# Deploy to Vercel

This guide will help you deploy your GameZone Arena application to Vercel.

## Quick Start

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repository
3. Add `DATABASE_URL` environment variable (if using external database)
4. Deploy!

Your app will be live at `https://your-app.vercel.app`

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free)
2. Your code pushed to GitHub, GitLab, or Bitbucket
3. Database connection string (if using external database)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Your Repository**
   - Go to [vercel.com](https://vercel.com) and log in
   - Click "Add New Project"
   - Import your GitHub/GitLab/Bitbucket repository

2. **Configure Project**
   - Vercel will auto-detect the configuration from `vercel.json`
   - Framework Preset: **Other**
   - Build Command: `npm run vercel-build` (auto-detected)
   - Output Directory: `dist/public` (auto-detected)

3. **Set Environment Variables**
   If you're using an external database, add these in the Vercel dashboard:
   - Go to **Settings → Environment Variables**
   - Add your database connection string:
     ```
     DATABASE_URL=your_database_connection_string
     ```
   - Or for read-only access:
     ```
     READONLY_DATABASE_URL=your_readonly_connection_string
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a URL like `https://your-app.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add DATABASE_URL
   ```
   Then paste your database connection string when prompted.

## How It Works

- **Backend**: A lightweight serverless function in `/api/index.ts` handles API requests
- **Frontend**: Vite builds your React app to static files in `/dist/public`
- **Routing**: 
  - `/api/*` requests → Serverless function
  - All other requests → React frontend (static files + SPA routing)

## Important Notes

### Database Connection
- Make sure your database (if using one) allows connections from Vercel's IP addresses
- Neon, Supabase, and PlanetScale work great with Vercel
- Connection pooling is handled automatically by `@neondatabase/serverless`

### Serverless Function Limits
- Free tier: 10-second execution timeout
- Pro tier: 60-second execution timeout
- If you need longer execution times, consider upgrading or using background jobs

### Environment Variables
Environment variables are set in the Vercel dashboard and are injected at build time and runtime:
- Build-time variables: Available during `npm run vercel-build`
- Runtime variables: Available to serverless functions

## Continuous Deployment

Once connected, Vercel automatically deploys:
- **Production**: Every push to your `main` or `master` branch
- **Preview**: Every push to other branches and pull requests

## Custom Domain

To add a custom domain:
1. Go to your project in Vercel
2. Click **Settings → Domains**
3. Add your domain and follow the DNS configuration instructions

## Monitoring

View your deployment logs and analytics:
- **Deployments**: See all deployments and their status
- **Functions**: Monitor serverless function execution
- **Analytics**: Track page views and performance (Pro plan)

## Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation with `npm run check`

### API Routes Return 404
- Verify `vercel.json` is properly configured
- Check that your API routes start with `/api/`
- Review function logs in Vercel dashboard

### Database Connection Errors
- Confirm `DATABASE_URL` is set in Environment Variables
- Check database allows Vercel IP addresses
- Verify connection string format is correct

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Serverless Functions Guide](https://vercel.com/docs/functions)
