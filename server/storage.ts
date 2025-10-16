import { type Cafe } from "@shared/schema";

export interface IStorage {
  getCafe(): Promise<Cafe>;
}

export class MemStorage implements IStorage {
  private cafe: Cafe;

  constructor() {
    // Initialize with GameZone Arena data matching the screenshot
    this.cafe = {
      id: "1",
      name: "GameZone Arena",
      rating: 4.5,
      location: "Dombivli West",
      distance: "0.5 km",
      about: "Premium gaming cafe with high-end PCs, latest consoles, VR headsets, and racing simulators. Perfect for competitive gaming.",
      phoneNumber: "+919876543210",
      whatsappNumber: "919876543210",
      mapUrl: "https://maps.google.com",
      gamingStations: [
        {
          id: "pc",
          type: "PC",
          available: 8,
          total: 12,
          status: "Available Now",
          icon: "monitor"
        },
        {
          id: "ps5",
          type: "PS5",
          available: 2,
          total: 4,
          status: "Available Now",
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
      ],
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
    return this.cafe;
  }
}

export const storage = new MemStorage();
