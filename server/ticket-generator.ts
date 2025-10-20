import type { TournamentTicket } from "@shared/schema";

export function generateTicketSVG(ticket: TournamentTicket): string {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="600" height="800" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a0b2e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#2d1b4e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a0b2e;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6366f1;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Main background -->
  <rect width="600" height="800" fill="url(#bg-gradient)"/>
  
  <!-- Decorative elements -->
  <circle cx="50" cy="50" r="100" fill="#8b5cf6" opacity="0.1"/>
  <circle cx="550" cy="750" r="120" fill="#6366f1" opacity="0.1"/>
  
  <!-- Header -->
  <rect x="0" y="0" width="600" height="150" fill="url(#accent-gradient)" opacity="0.3"/>
  
  <!-- Title -->
  <text x="300" y="70" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#ffffff" text-anchor="middle">
    TOURNAMENT TICKET
  </text>
  <text x="300" y="105" font-family="Arial, sans-serif" font-size="18" fill="#a78bfa" text-anchor="middle">
    GameZone Arena
  </text>
  
  <!-- Ticket Number Box -->
  <rect x="200" y="170" width="200" height="80" rx="10" fill="#8b5cf6" opacity="0.2" stroke="#8b5cf6" stroke-width="2"/>
  <text x="300" y="200" font-family="Arial, sans-serif" font-size="14" fill="#a78bfa" text-anchor="middle">
    TICKET NUMBER
  </text>
  <text x="300" y="235" font-family="monospace" font-size="32" font-weight="bold" fill="#ffffff" text-anchor="middle">
    ${ticket.ticketNumber}
  </text>
  
  <!-- Player Details -->
  <g transform="translate(80, 300)">
    <!-- Name -->
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="14" fill="#a78bfa" font-weight="600">
      PLAYER NAME
    </text>
    <text x="0" y="30" font-family="Arial, sans-serif" font-size="20" fill="#ffffff" font-weight="500">
      ${escapeXml(ticket.name)}
    </text>
    
    <!-- Email -->
    <text x="0" y="80" font-family="Arial, sans-serif" font-size="14" fill="#a78bfa" font-weight="600">
      EMAIL
    </text>
    <text x="0" y="110" font-family="Arial, sans-serif" font-size="16" fill="#ffffff">
      ${escapeXml(ticket.email)}
    </text>
    
    <!-- Phone -->
    <text x="0" y="160" font-family="Arial, sans-serif" font-size="14" fill="#a78bfa" font-weight="600">
      PHONE
    </text>
    <text x="0" y="190" font-family="Arial, sans-serif" font-size="18" fill="#ffffff">
      ${escapeXml(ticket.phone)}
    </text>
    
    <!-- Game -->
    <text x="0" y="240" font-family="Arial, sans-serif" font-size="14" fill="#a78bfa" font-weight="600">
      GAME PREFERENCE
    </text>
    <text x="0" y="270" font-family="Arial, sans-serif" font-size="20" fill="#ffffff" font-weight="500">
      ${escapeXml(ticket.gamePreference)}
    </text>
  </g>
  
  <!-- Registration Date -->
  <rect x="80" y="630" width="440" height="60" rx="8" fill="#1f1f1f" opacity="0.5"/>
  <text x="300" y="655" font-family="Arial, sans-serif" font-size="12" fill="#a78bfa" text-anchor="middle">
    REGISTERED ON
  </text>
  <text x="300" y="680" font-family="Arial, sans-serif" font-size="16" fill="#ffffff" text-anchor="middle">
    ${new Date(ticket.createdAt).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
  </text>
  
  <!-- Footer -->
  <text x="300" y="740" font-family="Arial, sans-serif" font-size="12" fill="#6b7280" text-anchor="middle">
    Please present this ticket at the venue
  </text>
  <text x="300" y="760" font-family="Arial, sans-serif" font-size="10" fill="#4b5563" text-anchor="middle">
    GameZone Arena • Dombivli West • +91-9876543210
  </text>
</svg>`;

  return svg;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateRandomTicketNumber(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}
