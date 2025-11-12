import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get cafe data
  app.get("/api/cafe", async (_req, res) => {
    try {
      const cafe = await storage.getCafe();
      res.json(cafe);
    } catch (error: any) {
      // SECURITY: Never expose internal error details to clients
      console.error("Error fetching cafe data:", error);
      res.status(500).json({ error: "Failed to fetch cafe data" });
    }
  });

  // Get seat details by category
  app.get("/api/seats/:category", async (req, res) => {
    try {
      const category = req.params.category;
      
      // SECURITY: Validate and sanitize category input
      if (!category || typeof category !== 'string') {
        return res.status(400).json({ error: "Invalid category" });
      }
      
      // Only allow alphanumeric, spaces, and hyphens
      if (!/^[a-zA-Z0-9\s\-]+$/.test(category)) {
        return res.status(400).json({ error: "Invalid category format" });
      }
      
      const seats = await storage.getSeatsByCategory(category);
      res.json(seats);
    } catch (error: any) {
      // SECURITY: Log detailed error server-side but send generic message to client
      console.error(`Error fetching seats for category ${req.params.category}:`, error);
      
      // Only expose safe, expected error codes
      if (error.statusCode === 404) {
        return res.status(404).json({ error: "Category not found" });
      }
      
      // For all other errors, send generic message
      res.status(500).json({ error: "Failed to fetch seat data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
