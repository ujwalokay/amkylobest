import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { neon } from "@neondatabase/serverless";
import { tournamentRegistrationSchema, tournamentCreationSchema } from "@shared/schema";
import { generateTicketSVG, generateRandomTicketNumber } from "./ticket-generator";
import { sendTournamentTicketEmail } from "./email-service";

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

  // Create tournament
  app.post("/api/tournaments", async (req, res) => {
    try {
      const validatedData = tournamentCreationSchema.parse(req.body);
      
      const result = await sql`
        INSERT INTO tournaments (
          title, game, description, start_date, max_participants, prize_pool, status
        ) VALUES (
          ${validatedData.title},
          ${validatedData.game},
          ${validatedData.description || null},
          ${validatedData.startDate},
          ${validatedData.maxParticipants},
          ${validatedData.prizePool || null},
          'upcoming'
        )
        RETURNING id, title, game, description, 
                  start_date as "startDate", max_participants as "maxParticipants",
                  prize_pool as "prizePool", status, created_at as "createdAt"
      `;
      
      const tournament = result[0];
      res.json({
        ...tournament,
        startDate: new Date(tournament.startDate).toISOString(),
        createdAt: new Date(tournament.createdAt).toISOString(),
        participantCount: 0,
      });
    } catch (error: any) {
      console.error("Tournament creation error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid tournament data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create tournament" });
    }
  });

  // Get all tournaments
  app.get("/api/tournaments", async (_req, res) => {
    try {
      const tournaments = await sql`
        SELECT 
          t.id, 
          t.title, 
          t.game, 
          t.description, 
          t.start_date as "startDate",
          t.max_participants as "maxParticipants",
          t.prize_pool as "prizePool",
          t.status,
          t.created_at as "createdAt",
          COUNT(tr.id) as "participantCount"
        FROM tournaments t
        LEFT JOIN tournament_registrations tr ON t.id = tr.tournament_id
        GROUP BY t.id
        ORDER BY t.start_date ASC
      `;
      
      res.json(tournaments.map(t => ({
        ...t,
        startDate: new Date(t.startDate).toISOString(),
        createdAt: new Date(t.createdAt).toISOString(),
        participantCount: parseInt(t.participantCount as string),
      })));
    } catch (error) {
      console.error("Get tournaments error:", error);
      res.status(500).json({ error: "Failed to fetch tournaments" });
    }
  });

  // Get tournament by ID
  app.get("/api/tournaments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = await sql`
        SELECT 
          t.id, 
          t.title, 
          t.game, 
          t.description, 
          t.start_date as "startDate",
          t.max_participants as "maxParticipants",
          t.prize_pool as "prizePool",
          t.status,
          t.created_at as "createdAt",
          COUNT(tr.id) as "participantCount"
        FROM tournaments t
        LEFT JOIN tournament_registrations tr ON t.id = tr.tournament_id
        WHERE t.id = ${id}
        GROUP BY t.id
      `;
      
      if (result.length === 0) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      
      const tournament = result[0];
      res.json({
        ...tournament,
        startDate: new Date(tournament.startDate).toISOString(),
        createdAt: new Date(tournament.createdAt).toISOString(),
        participantCount: parseInt(tournament.participantCount as string),
      });
    } catch (error) {
      console.error("Get tournament error:", error);
      res.status(500).json({ error: "Failed to fetch tournament" });
    }
  });

  // Register for tournament
  app.post("/api/tournament/register", async (req, res) => {
    try {
      // Validate request body
      const validatedData = tournamentRegistrationSchema.parse(req.body);
      
      // Check if tournament exists and has space
      const tournamentCheck = await sql`
        SELECT 
          t.id, 
          t.max_participants as "maxParticipants",
          COUNT(tr.id) as "participantCount"
        FROM tournaments t
        LEFT JOIN tournament_registrations tr ON t.id = tr.tournament_id
        WHERE t.id = ${validatedData.tournamentId}
        GROUP BY t.id
      `;
      
      if (tournamentCheck.length === 0) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      
      const tournament = tournamentCheck[0];
      const currentParticipants = parseInt(tournament.participantCount as string);
      
      if (currentParticipants >= tournament.maxParticipants) {
        return res.status(400).json({ error: "Tournament is full" });
      }
      
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
          tournament_id, name, email, phone, game_preference, ticket_number
        ) VALUES (
          ${validatedData.tournamentId},
          ${validatedData.name},
          ${validatedData.email},
          ${validatedData.phone},
          ${validatedData.gamePreference},
          ${ticketNumber}
        )
        RETURNING id, tournament_id as "tournamentId", name, email, phone, 
                  game_preference as "gamePreference", 
                  ticket_number as "ticketNumber", created_at as "createdAt"
      `;
      
      const ticket = result[0];
      const createdAtString = new Date(ticket.createdAt).toISOString();
      
      // Generate ticket SVG
      const ticketSVG = generateTicketSVG({
        id: ticket.id,
        tournamentId: ticket.tournamentId,
        name: ticket.name,
        email: ticket.email,
        phone: ticket.phone,
        gamePreference: ticket.gamePreference,
        ticketNumber: ticket.ticketNumber,
        createdAt: createdAtString,
      });
      
      // Send email with ticket (async, don't wait for it)
      sendTournamentTicketEmail(
        {
          id: ticket.id,
          tournamentId: ticket.tournamentId,
          name: ticket.name,
          email: ticket.email,
          phone: ticket.phone,
          gamePreference: ticket.gamePreference,
          ticketNumber: ticket.ticketNumber,
          createdAt: createdAtString,
        },
        ticketSVG
      ).then((emailResult) => {
        if (emailResult.success) {
          console.log(`Email sent successfully to ${ticket.email}`);
          sql`UPDATE tournament_registrations SET ticket_sent = true WHERE id = ${ticket.id}`.catch(
            (err) => console.error("Failed to update ticket_sent status:", err)
          );
        } else {
          console.error(`Failed to send email to ${ticket.email}:`, emailResult.message);
        }
      }).catch((err) => {
        console.error("Error in email sending process:", err);
      });
      
      res.json({
        success: true,
        ticket: {
          ...ticket,
          createdAt: createdAtString,
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
        SELECT id, tournament_id as "tournamentId", name, email, phone, 
               game_preference as "gamePreference", 
               ticket_number as "ticketNumber", created_at as "createdAt"
        FROM tournament_registrations 
        WHERE ticket_number = ${ticketNumber}
      `;
      
      if (result.length === 0) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      
      const ticket = result[0];
      const createdAtString = new Date(ticket.createdAt).toISOString();
      
      const ticketSVG = generateTicketSVG({
        id: ticket.id,
        tournamentId: ticket.tournamentId,
        name: ticket.name,
        email: ticket.email,
        phone: ticket.phone,
        gamePreference: ticket.gamePreference,
        ticketNumber: ticket.ticketNumber,
        createdAt: createdAtString,
      });
      
      res.json({
        ticket: {
          ...ticket,
          createdAt: createdAtString,
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
        SELECT id, tournament_id as "tournamentId", name, email, phone, 
               game_preference as "gamePreference", 
               ticket_number as "ticketNumber", created_at as "createdAt"
        FROM tournament_registrations 
        WHERE ticket_number = ${ticketNumber}
      `;
      
      if (result.length === 0) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      
      const ticket = result[0];
      const createdAtString = new Date(ticket.createdAt).toISOString();
      
      const ticketSVG = generateTicketSVG({
        id: ticket.id,
        tournamentId: ticket.tournamentId,
        name: ticket.name,
        email: ticket.email,
        phone: ticket.phone,
        gamePreference: ticket.gamePreference,
        ticketNumber: ticket.ticketNumber,
        createdAt: createdAtString,
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
