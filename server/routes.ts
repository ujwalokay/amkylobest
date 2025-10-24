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

  const httpServer = createServer(app);

  return httpServer;
}
