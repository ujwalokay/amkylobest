# GameZone Arena - Gaming Cafe Availability Viewer

## Overview

GameZone Arena is a single-page web application that displays real-time availability information for a gaming cafe. The application showcases gaming stations (PC, PS5, VR, Racing Simulators), available games, and amenities in a mobile-first, dark-themed interface inspired by gaming platforms like Steam and Discord.

The application provides users with:
- Real-time gaming station availability status
- Cafe information including ratings, location, and distance
- Contact options (phone, WhatsApp, maps)
- Gaming-tech hybrid design aesthetic optimized for mobile devices

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**October 25, 2025** - Vercel Deployment Configuration
- Added serverless function support for Vercel deployment
- Created `/api/index.ts` as the Vercel serverless entry point
- Configured `vercel.json` with proper routing for API, static assets, and SPA fallback
- Added `vercel-build` script to package.json
- Created comprehensive deployment guide in `VERCEL_DEPLOYMENT.md`
- Application is now ready for deployment to Vercel with zero-config setup

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast HMR (Hot Module Replacement)
- **Wouter** for lightweight client-side routing (alternative to React Router)
- **TanStack Query (React Query)** for server state management and data fetching

**UI Component System**
- **Shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Class Variance Authority (CVA)** for component variant management
- Dark-first design system with gaming aesthetic (purple/blue accents)
- Mobile-responsive card-based layouts

**Design System Configuration**
- Custom color palette defined in CSS variables (HSL format)
- Gaming-inspired typography using Inter font family
- Consistent spacing primitives (2, 3, 4, 6, 8, 12 units)
- Dark mode as default with vibrant accent colors for availability indicators

### Backend Architecture

**Server Framework**
- **Express.js** for HTTP server and API routing
- **TypeScript** with ES modules for type-safe server code
- Middleware for JSON parsing, URL encoding, and request logging
- Development-only Vite middleware integration for seamless dev experience

**API Design**
- RESTful endpoint: `GET /api/cafe` returns complete cafe data
- Single-page application serving static assets in production
- Error handling middleware for consistent error responses

**Data Layer**
- **In-memory storage** (`MemStorage` class) currently holding mock cafe data
- Interface-based storage pattern (`IStorage`) allowing future persistence layer swaps
- Data models defined using **Zod** schemas for runtime validation and TypeScript types

### Data Storage Solutions

**Current Implementation**
- In-memory storage with hardcoded cafe data (temporary solution)
- Structured data models: Cafe, GamingStation, Game, Amenity

**Planned Architecture** (based on Drizzle configuration)
- **PostgreSQL** database configured via `@neondatabase/serverless`
- **Drizzle ORM** for type-safe database queries and migrations
- Schema-first approach with Zod integration for validation
- Connection pooling through Neon serverless driver

**Data Schema Structure**
```typescript
- Cafe: Core entity with name, rating, location, contact info
- GamingStation: Type, availability count, total capacity, status
- Game: Name and platform association
- Amenity: Services and facilities offered
```

### External Dependencies

**Database & ORM**
- **Neon (PostgreSQL)**: Serverless PostgreSQL hosting (configured but not yet implemented)
- **Drizzle ORM**: Type-safe database client with migration support
- **Drizzle-Zod**: Schema validation bridge

**UI Component Libraries**
- **Radix UI**: Extensive primitive component collection (@radix-ui/react-*)
  - Dialog, Dropdown, Popover, Toast, Accordion, Tabs, etc.
  - Accessibility-focused headless components
- **Lucide React**: Icon library for UI elements
- **React Icons**: Additional icon support (WhatsApp icon)
- **Embla Carousel**: Touch-friendly carousel component

**Utility Libraries**
- **clsx & tailwind-merge**: Conditional class name composition
- **date-fns**: Date formatting and manipulation
- **React Hook Form**: Form state management
- **Hookform Resolvers**: Zod integration for form validation

**Development Tools**
- **Replit-specific plugins**: 
  - Runtime error modal overlay
  - Cartographer (code navigation)
  - Dev banner for development environment
- **TSX**: TypeScript execution for Node.js development
- **ESBuild**: Fast JavaScript bundler for production builds

**Session & State Management**
- **Connect-pg-simple**: PostgreSQL session store (configured for future use)
- **TanStack Query**: Client-side cache and async state management
  - Disabled refetch on window focus
  - Infinite stale time for static data
  - Custom fetch function with credential support

### Deployment Options

**Vercel (Configured)**
- Serverless function deployment via `/api/index.ts`
- Automatic routing configured in `vercel.json`:
  - `/api/*` routes to Express serverless function
  - Static assets served directly from build output
  - SPA fallback for client-side routing
- Build command: `npm run vercel-build`
- Output directory: `dist/public`
- Compatible with Neon PostgreSQL serverless driver
- See `VERCEL_DEPLOYMENT.md` for detailed deployment instructions

**Replit (Current Environment)**
- Development server runs via `npm run dev`
- Configured workflow serves on port 5000
- Hot module replacement enabled for rapid development