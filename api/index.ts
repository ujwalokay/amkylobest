import { storage } from "../server/storage";

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
      const cafe = await storage.getCafe();
      return res.status(200).json(cafe);
    }

    // Default response for root /api path
    if (path === '/' || path === '/api' || path === '/api/') {
      const cafe = await storage.getCafe();
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
