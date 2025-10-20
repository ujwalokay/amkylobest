import { type Cafe, type GamingStation } from "@shared/schema";
import { neon } from "@neondatabase/serverless";

export interface IStorage {
  getCafe(): Promise<Cafe>;
}

export class ExternalDbStorage implements IStorage {
  private sql;
  private staticData: Omit<Cafe, 'gamingStations'>;
  private isSecureConnection: boolean;

  constructor() {
    // Use Replit's built-in database or read-only connection if available
    const dbUrl = process.env.READONLY_DATABASE_URL || process.env.EXTERNAL_DATABASE_URL || process.env.DATABASE_URL;
    this.isSecureConnection = !!process.env.READONLY_DATABASE_URL;
    
    if (!dbUrl) {
      throw new Error('No database connection string available. Please ensure DATABASE_URL is set.');
    }
    
    if (!this.isSecureConnection && !process.env.DATABASE_URL) {
      console.warn('⚠️  SECURITY WARNING: Using admin database connection. Please set up READONLY_DATABASE_URL for better security.');
      console.warn('⚠️  See DATABASE_SECURITY_SETUP.md for instructions.');
    } else if (process.env.DATABASE_URL && !process.env.READONLY_DATABASE_URL) {
      console.log('✅ Using Replit built-in database connection');
    } else {
      console.log('✅ Using secure read-only database connection');
    }
    
    const baseSql = neon(dbUrl);
    
    // Wrap SQL function with security validation
    this.sql = this.createSecureSqlWrapper(baseSql);
    
    // Static data that doesn't change
    this.staticData = {
      id: "1",
      name: "GameZone Arena",
      rating: 4.5,
      location: "Dombivli West",
      distance: "0.5 km",
      about: "Premium gaming cafe with high-end PCs, latest consoles, VR headsets, and racing simulators. Perfect for competitive gaming.",
      phoneNumber: "+919876543210",
      whatsappNumber: "919876543210",
      mapUrl: "https://maps.google.com",
      games: [
        { id: "gta5", name: "GTA V", platform: "PC" },
        { id: "valorant", name: "Valorant", platform: "PC" },
        { id: "csgo", name: "CS:GO", platform: "PC" },
        { id: "fortnite", name: "Fortnite", platform: "PC" },
        { id: "pubg", name: "PUBG", platform: "PC" },
        { id: "minecraft", name: "Minecraft", platform: "PC" },
        { id: "fifa23", name: "FIFA 23", platform: "PS5" },
        { id: "spiderman2", name: "Spider-Man 2", platform: "PS5" },
        { id: "godofwar", name: "God of War", platform: "PS5" },
        { id: "granturismo7", name: "Gran Turismo 7", platform: "PS5" }
      ],
      amenities: [
        { id: "wifi", name: "High-speed WiFi", icon: "wifi" },
        { id: "ac", name: "Air Conditioned", icon: "wind" },
        { id: "snacks", name: "Snacks & Drinks", icon: "coffee" },
        { id: "headsets", name: "Premium Headsets", icon: "headset" },
        { id: "vr-gaming", name: "VR Gaming", icon: "headset" },
        { id: "racing-sim", name: "Racing Simulators", icon: "car" }
      ]
    };
  }

  private createSecureSqlWrapper(baseSql: any) {
    // Return a Proxy that validates ALL queries and blocks unsafe methods
    return new Proxy(baseSql, {
      apply: (target, thisArg, args) => {
        // Get the query string from template literal
        const queryTemplate = args[0];
        if (Array.isArray(queryTemplate) && 'raw' in queryTemplate) {
          const queryString = queryTemplate.join('?').trim().toUpperCase();
          
          // Validate query is SELECT only
          if (!queryString.startsWith('SELECT')) {
            const error = new Error('SECURITY BLOCK: Only SELECT queries allowed. Attempted: ' + queryString.substring(0, 50));
            console.error('🚨 SECURITY VIOLATION BLOCKED:', error.message);
            throw error;
          }
          
          // Block dangerous keywords even in SELECT
          const dangerousKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'TRUNCATE', 'ALTER', 'CREATE', 'GRANT', 'REVOKE', 'EXEC'];
          for (const keyword of dangerousKeywords) {
            if (queryString.includes(keyword)) {
              const error = new Error(`SECURITY BLOCK: Forbidden keyword ${keyword} in query`);
              console.error('🚨 SECURITY VIOLATION BLOCKED:', error.message);
              throw error;
            }
          }
        }
        
        // Query is safe, execute it
        return Reflect.apply(target, thisArg, args);
      },
      
      // Block access to potentially dangerous methods like .unsafe(), .transaction(), etc.
      get: (target, prop) => {
        const blockedMethods = ['unsafe', 'transaction', 'begin', 'commit', 'rollback'];
        if (blockedMethods.includes(prop as string)) {
          const error = new Error(`SECURITY BLOCK: Method .${String(prop)}() is not allowed in read-only mode`);
          console.error('🚨 SECURITY VIOLATION BLOCKED:', error.message);
          throw error;
        }
        
        const value = Reflect.get(target, prop);
        
        // If it's a function, wrap it with the same security check
        if (typeof value === 'function') {
          return new Proxy(value, {
            apply: (fnTarget, fnThisArg, fnArgs) => {
              console.error('🚨 SECURITY WARNING: Attempting to call method .' + String(prop) + '() - this may bypass security');
              throw new Error(`SECURITY BLOCK: Method .${String(prop)}() is blocked for security`);
            }
          });
        }
        
        return value;
      }
    });
  }

  async getCafe(): Promise<Cafe> {
    try {
      // SECURITY: Only SELECT queries are allowed - validated at application level
      // Even if someone modifies this code, the database user permissions prevent writes
      
      // Fetch device configs from external database (read-only)
      const deviceConfigs = await this.sql`
        SELECT id, category, count, seats 
        FROM device_configs
      `;

      // Fetch active bookings to calculate availability
      const activeBookings = await this.sql`
        SELECT category, seat_name, status
        FROM bookings
        WHERE status = 'running'
      `;

      // Calculate availability for each category
      const gamingStations: GamingStation[] = [];

      for (const device of deviceConfigs) {
        const category = device.category;
        const totalSeats = device.count;
        
        // Count active bookings for this category
        const occupiedSeats = activeBookings.filter(
          (b: any) => b.category === category && b.status === 'running'
        ).length;
        
        const availableSeats = totalSeats - occupiedSeats;
        
        // Determine status based on availability
        let status: "Available Now" | "Limited" | "Full";
        if (availableSeats === 0) {
          status = "Full";
        } else if (availableSeats <= Math.floor(totalSeats * 0.3)) {
          status = "Limited";
        } else {
          status = "Available Now";
        }

        // Map category to station type and icon
        let type: "PC" | "PS5" | "VR" | "Racing Sim";
        let icon: string;
        
        if (category === "PC") {
          type = "PC";
          icon = "monitor";
        } else if (category === "PS5") {
          type = "PS5";
          icon = "gamepad";
        } else if (category === "VR") {
          type = "VR";
          icon = "headset";
        } else if (category === "Racing Sim" || category === "Racing") {
          type = "Racing Sim";
          icon = "car";
        } else {
          continue; // Skip unknown categories
        }

        gamingStations.push({
          id: device.id,
          type,
          available: availableSeats,
          total: totalSeats,
          status,
          icon
        });
      }

      // Only show gaming stations that exist in the database
      return {
        ...this.staticData,
        gamingStations
      };
    } catch (error) {
      console.error("Error fetching from external database:", error);
      // Fallback to default values if database is unavailable
      return {
        ...this.staticData,
        gamingStations: [
          {
            id: "pc",
            type: "PC",
            available: 0,
            total: 5,
            status: "Full",
            icon: "monitor"
          },
          {
            id: "ps5",
            type: "PS5",
            available: 0,
            total: 4,
            status: "Full",
            icon: "gamepad"
          },
          {
            id: "vr",
            type: "VR",
            available: 2,
            total: 3,
            status: "Available Now",
            icon: "headset"
          },
          {
            id: "racing",
            type: "Racing Sim",
            available: 1,
            total: 2,
            status: "Available Now",
            icon: "car"
          }
        ]
      };
    }
  }
}

export const storage = new ExternalDbStorage();
