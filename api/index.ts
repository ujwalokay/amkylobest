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

  // Parse the URL to get the path
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const path = url.pathname;

  try {
    // Handle /api/cafe endpoint
    if (path === '/api/cafe' && req.method === 'GET') {
      const cafe = await storage.getCafe();
      return res.status(200).json(cafe);
    }

    // 404 for unknown endpoints
    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch cafe data' });
  }
}
