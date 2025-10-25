import type { Cafe } from "../shared/schema";

// Fallback cafe data for when database is not available
const fallbackCafeData: Cafe = {
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
  ],
  peakHoursInfo: "Peak hours: Friday-Sunday 6:00 PM - 11:00 PM",
  gamingStations: [
    { id: "pc", type: "PC", available: 8, total: 15, status: "Available Now", icon: "monitor" },
    { id: "ps5", type: "PS5", available: 3, total: 6, status: "Available Now", icon: "gamepad" },
    { id: "vr", type: "VR", available: 2, total: 4, status: "Available Now", icon: "headset" },
    { id: "racing", type: "Racing Sim", available: 1, total: 3, status: "Limited", icon: "car" }
  ]
};

async function getCafeData(): Promise<Cafe> {
  // Try to use database storage if available
  if (process.env.DATABASE_URL || process.env.READONLY_DATABASE_URL) {
    try {
      console.log('Attempting to connect to database...');
      console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
      console.log('READONLY_DATABASE_URL:', process.env.READONLY_DATABASE_URL ? 'Set' : 'Not set');
      
      const { storage } = await import("../server/storage");
      const cafe = await storage.getCafe();
      
      console.log('Successfully fetched cafe data from database');
      console.log('Gaming stations:', cafe.gamingStations.map(s => `${s.type}: ${s.available}/${s.total}`).join(', '));
      
      return cafe;
    } catch (error) {
      console.error('DATABASE ERROR - Using fallback data instead:');
      console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return fallbackCafeData;
    }
  }
  
  // Use fallback data if no database configured
  console.log('No database environment variables found, using fallback data');
  return fallbackCafeData;
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // On Vercel, the path will be /cafe (without /api prefix since that's already handled by routing)
  // Also handle the full path for compatibility
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const path = url.pathname;

  try {
    // Handle cafe endpoint - check for both /cafe and /api/cafe
    if ((path === '/cafe' || path === '/api/cafe') && req.method === 'GET') {
      const cafe = await getCafeData();
      return res.status(200).json(cafe);
    }

    // Default response for root /api path
    if (path === '/' || path === '/api' || path === '/api/') {
      const cafe = await getCafeData();
      return res.status(200).json(cafe);
    }

    // 404 for unknown endpoints
    console.log('Unknown path:', path);
    return res.status(404).json({ error: 'Not found', path });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch cafe data', message: error instanceof Error ? error.message : 'Unknown error' });
  }
}
