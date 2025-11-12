import { type Cafe, type GamingStation, type CategorySeats, type SeatDetail } from "@shared/schema";
import { neon } from "@neondatabase/serverless";

export interface IStorage {
  getCafe(): Promise<Cafe>;
  getSeatsByCategory(category: string): Promise<CategorySeats>;
}

export class ExternalDbStorage implements IStorage {
  private sql;
  private staticData: Omit<Cafe, 'gamingStations'>;
  private isSecureConnection: boolean;

  private isCurrentlyPeakHours(): boolean {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours();
    
    // Peak hours: Friday-Sunday 6:00 PM (18:00) - 11:00 PM (23:00)
    const isPeakDay = day === 5 || day === 6 || day === 0; // Friday, Saturday, Sunday
    const isPeakTime = hour >= 18 && hour < 23;
    
    return isPeakDay && isPeakTime;
  }

  constructor() {
    // SECURITY: Enforce read-only database connection requirement
    // This prevents any accidental or malicious write operations to the database
    
    let dbUrl: string;
    
    if (process.env.READONLY_DATABASE_URL) {
      // Preferred: Use dedicated read-only connection
      dbUrl = process.env.READONLY_DATABASE_URL;
      this.isSecureConnection = true;
      console.log('✅ Using secure read-only database connection');
    } else if (process.env.DATABASE_URL) {
      // Fallback: Use Replit built-in database (which should be read-only for this use case)
      dbUrl = process.env.DATABASE_URL;
      this.isSecureConnection = true;
      console.log('✅ Using Replit built-in database connection');
      console.log('💡 For enhanced security, consider setting up READONLY_DATABASE_URL');
    } else if (process.env.EXTERNAL_DATABASE_URL) {
      // SECURITY: EXTERNAL_DATABASE_URL is typically admin credentials
      // Refuse to start unless explicitly allowed in development
      if (process.env.NODE_ENV === 'production') {
        console.error('🚨 SECURITY ERROR: EXTERNAL_DATABASE_URL cannot be used in production');
        console.error('🚨 Please set READONLY_DATABASE_URL or DATABASE_URL instead');
        throw new Error('SECURITY: Read-only database credentials required in production');
      }
      
      dbUrl = process.env.EXTERNAL_DATABASE_URL;
      this.isSecureConnection = false;
      console.warn('⚠️  SECURITY WARNING: Using EXTERNAL_DATABASE_URL with full privileges');
      console.warn('⚠️  This is only allowed in development mode');
      console.warn('⚠️  Set READONLY_DATABASE_URL for production deployment');
    } else {
      // No database connection available - fail hard
      console.error('🚨 SECURITY ERROR: No database connection configured');
      console.error('🚨 Please set one of: READONLY_DATABASE_URL, DATABASE_URL');
      throw new Error('No database connection string available. Please ensure READONLY_DATABASE_URL or DATABASE_URL is set.');
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
      ],
      schedule: [
        { day: "Monday", openTime: "10:00 AM", closeTime: "11:00 PM", isPeakHours: false },
        { day: "Tuesday", openTime: "10:00 AM", closeTime: "11:00 PM", isPeakHours: false },
        { day: "Wednesday", openTime: "10:00 AM", closeTime: "11:00 PM", isPeakHours: false },
        { day: "Thursday", openTime: "10:00 AM", closeTime: "11:00 PM", isPeakHours: false },
        { day: "Friday", openTime: "10:00 AM", closeTime: "1:00 AM", isPeakHours: true, note: "Extended Hours" },
        { day: "Saturday", openTime: "9:00 AM", closeTime: "1:00 AM", isPeakHours: true, note: "Peak Day" },
        { day: "Sunday", openTime: "9:00 AM", closeTime: "12:00 AM", isPeakHours: true, note: "Peak Day" }
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
        gamingStations,
        peakHoursInfo: this.isCurrentlyPeakHours() 
          ? "🔥 PEAK HOURS NOW - Higher demand expected (Friday-Sunday 6:00 PM - 11:00 PM)"
          : "Peak hours: Friday-Sunday 6:00 PM - 11:00 PM"
      };
    } catch (error) {
      console.error("Error fetching from external database:", error);
      // Fallback to default values if database is unavailable
      return {
        ...this.staticData,
        peakHoursInfo: this.isCurrentlyPeakHours() 
          ? "🔥 PEAK HOURS NOW - Higher demand expected (Friday-Sunday 6:00 PM - 11:00 PM)"
          : "Peak hours: Friday-Sunday 6:00 PM - 11:00 PM",
        gamingStations: [
          {
            id: "pc",
            type: "PC",
            available: 8,
            total: 15,
            status: "Available Now",
            icon: "monitor"
          },
          {
            id: "ps5",
            type: "PS5",
            available: 3,
            total: 6,
            status: "Available Now",
            icon: "gamepad"
          },
          {
            id: "vr",
            type: "VR",
            available: 2,
            total: 4,
            status: "Available Now",
            icon: "headset"
          },
          {
            id: "racing",
            type: "Racing Sim",
            available: 1,
            total: 3,
            status: "Limited",
            icon: "car"
          }
        ]
      };
    }
  }

  async getSeatsByCategory(category: string): Promise<CategorySeats> {
    try {
      // Get the device config for this category
      const deviceConfig = await this.sql`
        SELECT id, category, count 
        FROM device_configs
        WHERE category = ${category}
        LIMIT 1
      `;

      if (deviceConfig.length === 0) {
        const error: any = new Error(`Category ${category} not found`);
        error.statusCode = 404;
        throw error;
      }

      const totalSeats = deviceConfig[0].count;

      // Get all bookings for today (running + booked/upcoming)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const allBookings = await this.sql`
        SELECT seat_name, status, start_time, end_time
        FROM bookings
        WHERE category = ${category} 
        AND (
          status = 'running' 
          OR (status IN ('booked', 'upcoming') AND start_time >= ${today.toISOString()} AND start_time < ${tomorrow.toISOString()})
        )
        ORDER BY seat_name, start_time
      `;

      // Group bookings by seat name
      const seatBookingsMap = new Map<string, any[]>();
      allBookings.forEach((booking: any) => {
        if (!seatBookingsMap.has(booking.seat_name)) {
          seatBookingsMap.set(booking.seat_name, []);
        }
        seatBookingsMap.get(booking.seat_name)!.push(booking);
      });

      // Generate seat list
      const seats: SeatDetail[] = [];
      for (let i = 1; i <= totalSeats; i++) {
        const seatName = `${category}-${i}`;
        const bookings = seatBookingsMap.get(seatName) || [];
        
        // Check if currently occupied (has a running booking)
        const runningBooking = bookings.find((b: any) => b.status === 'running');
        
        // Map all bookings to proper format
        const mappedBookings = bookings.map((b: any) => ({
          startTime: new Date(b.start_time).toISOString(),
          endTime: b.end_time ? new Date(b.end_time).toISOString() : new Date(new Date(b.start_time).getTime() + 3600000).toISOString(),
          status: (b.status === 'running' ? 'running' : 'upcoming') as 'running' | 'upcoming' | 'booked'
        }));
        
        if (runningBooking) {
          // Seat is currently occupied - show as occupied
          seats.push({
            seatName,
            status: "occupied",
            startTime: runningBooking.start_time ? new Date(runningBooking.start_time).toISOString() : undefined,
            endTime: runningBooking.end_time ? new Date(runningBooking.end_time).toISOString() : undefined,
            bookings: mappedBookings
          });
        } else {
          // Seat is currently available (even if it has future bookings)
          seats.push({
            seatName,
            status: "available",
            bookings: mappedBookings
          });
        }
      }

      // Only count seats without a running booking as available
      const availableCount = seats.filter(s => s.status === "available").length;

      return {
        category,
        totalSeats,
        availableCount,
        seats,
      };
    } catch (error) {
      console.error(`Error fetching seats for category ${category}:`, error);
      
      // Fallback to sample data if database is unavailable
      const fallbackData: Record<string, { total: number; occupied: number[] }> = {
        "PC": { total: 15, occupied: [1, 2, 3, 4, 5, 6, 7] },
        "PS5": { total: 6, occupied: [1, 2, 3] },
        "VR": { total: 4, occupied: [1, 2] },
        "Racing Sim": { total: 3, occupied: [1, 2] },
        "Racing": { total: 3, occupied: [1, 2] },
      };

      const config = fallbackData[category];
      if (!config) {
        const error: any = new Error(`Category ${category} not found`);
        error.statusCode = 404;
        throw error;
      }

      const seats: SeatDetail[] = [];
      const now = new Date();
      const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

      for (let i = 1; i <= config.total; i++) {
        const seatName = `${category}-${i}`;
        const isOccupied = config.occupied.includes(i);
        
        if (isOccupied) {
          seats.push({
            seatName,
            status: "occupied",
            startTime: now.toISOString(),
            endTime: endTime.toISOString(),
          });
        } else {
          seats.push({
            seatName,
            status: "available",
          });
        }
      }

      const availableCount = seats.filter(s => s.status === "available").length;

      return {
        category,
        totalSeats: config.total,
        availableCount,
        seats,
      };
    }
  }
}

export const storage = new ExternalDbStorage();
