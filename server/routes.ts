import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

  // Get seat details by category
  app.get("/api/seats/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const seats = await storage.getSeatsByCategory(category);
      res.json(seats);
    } catch (error: any) {
      console.error("Error fetching seats:", error);
      const status = error.statusCode || 500;
      res.status(status).json({ error: error.message || "Failed to fetch seat data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
