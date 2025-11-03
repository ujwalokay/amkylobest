import { z } from "zod";

// Gaming Station Schema
export const gamingStationSchema = z.object({
  id: z.string(),
  type: z.enum(["PC", "PS5", "VR", "Racing Sim"]),
  available: z.number(),
  total: z.number(),
  status: z.enum(["Available Now", "Limited", "Full"]),
  icon: z.string(),
});

export type GamingStation = z.infer<typeof gamingStationSchema>;

// Game Schema
export const gameSchema = z.object({
  id: z.string(),
  name: z.string(),
  platform: z.enum(["PC", "PS5"]),
});

export type Game = z.infer<typeof gameSchema>;

// Amenity Schema
export const amenitySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
});

export type Amenity = z.infer<typeof amenitySchema>;

// Schedule Schema
export const scheduleSchema = z.object({
  day: z.string(),
  openTime: z.string(),
  closeTime: z.string(),
  isPeakHours: z.boolean().optional(),
  note: z.string().optional(),
});

export type Schedule = z.infer<typeof scheduleSchema>;

// Cafe Schema
export const cafeSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.number(),
  location: z.string(),
  distance: z.string(),
  about: z.string(),
  gamingStations: z.array(gamingStationSchema),
  games: z.array(gameSchema),
  amenities: z.array(amenitySchema),
  phoneNumber: z.string().optional(),
  whatsappNumber: z.string().optional(),
  mapUrl: z.string().optional(),
  schedule: z.array(scheduleSchema).optional(),
  peakHoursInfo: z.string().optional(),
});

export type Cafe = z.infer<typeof cafeSchema>;

// Seat Detail Schema
export const seatDetailSchema = z.object({
  seatName: z.string(),
  status: z.enum(["available", "occupied"]),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export type SeatDetail = z.infer<typeof seatDetailSchema>;

// Category Seats Schema
export const categorySeatsSchema = z.object({
  category: z.string(),
  totalSeats: z.number(),
  availableCount: z.number(),
  seats: z.array(seatDetailSchema),
});

export type CategorySeats = z.infer<typeof categorySeatsSchema>;
