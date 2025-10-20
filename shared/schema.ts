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
});

export type Cafe = z.infer<typeof cafeSchema>;

// Tournament Schema
export const tournamentSchema = z.object({
  id: z.number(),
  title: z.string(),
  game: z.string(),
  description: z.string().optional(),
  startDate: z.string(),
  maxParticipants: z.number(),
  prizePool: z.string().optional(),
  status: z.enum(["upcoming", "ongoing", "completed"]),
  createdAt: z.string(),
  participantCount: z.number().optional(),
});

export type Tournament = z.infer<typeof tournamentSchema>;

// Tournament Creation Schema
export const tournamentCreationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  game: z.string().min(1, "Please select a game"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  maxParticipants: z.coerce.number().min(2, "Must have at least 2 participants"),
  prizePool: z.string().optional(),
});

export type TournamentCreation = z.infer<typeof tournamentCreationSchema>;

// Tournament Registration Schema
export const tournamentRegistrationSchema = z.object({
  tournamentId: z.number(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gamePreference: z.string().min(1, "Please select a game"),
});

export type TournamentRegistration = z.infer<typeof tournamentRegistrationSchema>;

// Tournament Ticket Schema
export const tournamentTicketSchema = z.object({
  id: z.number(),
  tournamentId: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  gamePreference: z.string(),
  ticketNumber: z.string(),
  createdAt: z.string(),
});

export type TournamentTicket = z.infer<typeof tournamentTicketSchema>;
