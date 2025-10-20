import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { neon } from "@neondatabase/serverless";
import { tournamentRegistrationSchema } from "@shared/schema";
import { generateTicketSVG, generateRandomTicketNumber } from "./ticket-generator";

const sql = neon(process.env.DATABASE_URL!);

export async function registerRoutes(app: Express): Promise<Server> {
  // Get cafe data
  app.get("/api/cafe", async (_req, res) => {
    try {
      const cafe = await storage.getCafe();
      res.json(cafe);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cafe data" });
    }
  });

  // Register for tournament
  app.post("/api/tournament/register", async (req, res) => {
    try {
      // Validate request body
      const validatedData = tournamentRegistrationSchema.parse(req.body);
      
      // Generate unique ticket number
      let ticketNumber = generateRandomTicketNumber();
      let isUnique = false;
      let attempts = 0;
      
      while (!isUnique && attempts < 10) {
        const existing = await sql`
          SELECT ticket_number FROM tournament_registrations 
          WHERE ticket_number = ${ticketNumber}
        `;
        
        if (existing.length === 0) {
          isUnique = true;
        } else {
          ticketNumber = generateRandomTicketNumber();
          attempts++;
        }
      }
      
      if (!isUnique) {
        return res.status(500).json({ error: "Failed to generate unique ticket number" });
      }
      
      // Insert registration
      const result = await sql`
        INSERT INTO tournament_registrations (
          name, email, phone, game_preference, ticket_number
        ) VALUES (
          ${validatedData.name},
          ${validatedData.email},
          ${validatedData.phone},
          ${validatedData.gamePreference},
          ${ticketNumber}
        )
        RETURNING id, name, email, phone, game_preference as "gamePreference", 
                  ticket_number as "ticketNumber", created_at as "createdAt"
      `;
      
      const ticket = result[0];
      
      // Generate ticket SVG
      const ticketSVG = generateTicketSVG({
        id: ticket.id,
        name: ticket.name,
        email: ticket.email,
        phone: ticket.phone,
        gamePreference: ticket.gamePreference,
        ticketNumber: ticket.ticketNumber,
        createdAt: ticket.createdAt.toISOString(),
      });
      
      res.json({
        success: true,
        ticket: {
          ...ticket,
          createdAt: ticket.createdAt.toISOString(),
        },
        ticketSVG,
      });
    } catch (error: any) {
      console.error("Tournament registration error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid registration data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to register for tournament" });
    }
  });

  // Get ticket by ticket number
  app.get("/api/tournament/ticket/:ticketNumber", async (req, res) => {
    try {
      const { ticketNumber } = req.params;
      
      const result = await sql`
        SELECT id, name, email, phone, game_preference as "gamePreference", 
               ticket_number as "ticketNumber", created_at as "createdAt"
        FROM tournament_registrations 
        WHERE ticket_number = ${ticketNumber}
      `;
      
      if (result.length === 0) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      
      const ticket = result[0];
      const ticketSVG = generateTicketSVG({
        id: ticket.id,
        name: ticket.name,
        email: ticket.email,
        phone: ticket.phone,
        gamePreference: ticket.gamePreference,
        ticketNumber: ticket.ticketNumber,
        createdAt: ticket.createdAt.toISOString(),
      });
      
      res.json({
        ticket: {
          ...ticket,
          createdAt: ticket.createdAt.toISOString(),
        },
        ticketSVG,
      });
    } catch (error) {
      console.error("Ticket retrieval error:", error);
      res.status(500).json({ error: "Failed to retrieve ticket" });
    }
  });

  // Download ticket as SVG
  app.get("/api/tournament/download/:ticketNumber", async (req, res) => {
    try {
      const { ticketNumber } = req.params;
      
      const result = await sql`
        SELECT id, name, email, phone, game_preference as "gamePreference", 
               ticket_number as "ticketNumber", created_at as "createdAt"
        FROM tournament_registrations 
        WHERE ticket_number = ${ticketNumber}
      `;
      
      if (result.length === 0) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      
      const ticket = result[0];
      const ticketSVG = generateTicketSVG({
        id: ticket.id,
        name: ticket.name,
        email: ticket.email,
        phone: ticket.phone,
        gamePreference: ticket.gamePreference,
        ticketNumber: ticket.ticketNumber,
        createdAt: ticket.createdAt.toISOString(),
      });
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Content-Disposition', `attachment; filename="tournament-ticket-${ticketNumber}.svg"`);
      res.send(ticketSVG);
    } catch (error) {
      console.error("Ticket download error:", error);
      res.status(500).json({ error: "Failed to download ticket" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
