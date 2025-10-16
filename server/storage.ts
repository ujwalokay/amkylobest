import { type Cafe, type GamingStation } from "@shared/schema";
import { neon } from "@neondatabase/serverless";

export interface IStorage {
  getCafe(): Promise<Cafe>;
}

export class ExternalDbStorage implements IStorage {
  private sql;
  private staticData: Omit<Cafe, 'gamingStations'>;

  constructor() {
    // Initialize connection to external database (read-only)
    this.sql = neon(process.env.EXTERNAL_DATABASE_URL!);
    
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

  async getCafe(): Promise<Cafe> {
    try {
      // Fetch device configs from external database (read-only)
      const deviceConfigs = await this.sql`
        SELECT id, category, count, seats 
        FROM device_configs
      `;

      // Fetch active bookings to calculate availability
      const activeBookings = await this.sql`
        SELECT category, seat_name, status
        FROM bookings
        WHERE status = 'active'
      `;

      // Calculate availability for each category
      const gamingStations: GamingStation[] = [];

      for (const device of deviceConfigs) {
        const category = device.category;
        const totalSeats = device.count;
        
        // Count active bookings for this category
        const occupiedSeats = activeBookings.filter(
          (b: any) => b.category === category && b.status === 'active'
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
