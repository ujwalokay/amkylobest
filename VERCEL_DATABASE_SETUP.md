# Fix Real-Time Availability on Vercel

## Problem
Your Vercel app is showing static data (8/15 PC, 3/6 PS5) because it can't connect to the database.

## Solution - 3 Steps

### Step 1: Add DATABASE_URL to Vercel

1. **Go to your Vercel project dashboard**
   - https://vercel.com/dashboard
   - Select your project (amkyfobest)

2. **Go to Settings → Environment Variables**

3. **Add a new environment variable:**
   - **Name:** `DATABASE_URL`
   - **Value:** Your Neon database connection string
     ```
     postgresql://username:password@ep-xxxxx.region.neon.tech/neondb?sslmode=require
     ```
   - **Environments:** Check all (Production, Preview, Development)

4. **Click "Save"**

### Step 2: Create Database Tables

1. **Open Neon SQL Editor**
   - Go to https://console.neon.tech/
   - Select your database project
   - Click "SQL Editor"

2. **Copy and run this SQL:**

```sql
-- Create tables
CREATE TABLE IF NOT EXISTS device_configs (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  count INTEGER NOT NULL,
  seats JSONB
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  seat_name TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add gaming station configurations
INSERT INTO device_configs (id, category, count, seats) VALUES
  ('pc', 'PC', 15, '[]'),
  ('ps5', 'PS5', 6, '[]'),
  ('vr', 'VR', 4, '[]'),
  ('racing', 'Racing Sim', 3, '[]')
ON CONFLICT (id) DO NOTHING;

-- Add current bookings (this controls what's shown as available)
-- PC: 7 occupied = 8 available out of 15
INSERT INTO bookings (category, seat_name, status) VALUES
  ('PC', 'PC-1', 'running'),
  ('PC', 'PC-2', 'running'),
  ('PC', 'PC-3', 'running'),
  ('PC', 'PC-4', 'running'),
  ('PC', 'PC-5', 'running'),
  ('PC', 'PC-6', 'running'),
  ('PC', 'PC-7', 'running');

-- PS5: 3 occupied = 3 available out of 6
INSERT INTO bookings (category, seat_name, status) VALUES
  ('PS5', 'PS5-1', 'running'),
  ('PS5', 'PS5-2', 'running'),
  ('PS5', 'PS5-3', 'running');

-- VR: 2 occupied = 2 available out of 4
INSERT INTO bookings (category, seat_name, status) VALUES
  ('VR', 'VR-1', 'running'),
  ('VR', 'VR-2', 'running');

-- Racing Sim: 2 occupied = 1 available out of 3
INSERT INTO bookings (category, seat_name, status) VALUES
  ('Racing', 'Racing-1', 'running'),
  ('Racing', 'Racing-2', 'running');
```

3. **Click "Run" to execute**

### Step 3: Redeploy Your Vercel App

1. **Go to your Vercel project**
2. **Click "Deployments" tab**
3. **Click the "..." menu on the latest deployment**
4. **Click "Redeploy"**

**OR simply push a new commit to your GitHub repo** - Vercel will auto-redeploy.

---

## Verify It's Working

After redeploying, visit your Vercel app and you should see the real-time data from the database!

---

## How to Update Availability Daily

To update what's shown on your website, just update the `bookings` table:

### Quick Update Script
```sql
-- Clear all bookings
TRUNCATE TABLE bookings;

-- Add current occupied stations
-- Example: 10 PCs occupied (5 available)
INSERT INTO bookings (category, seat_name, status) 
SELECT 'PC', 'PC-' || i, 'running' 
FROM generate_series(1, 10) AS i;

-- Example: 2 PS5 occupied (4 available)
INSERT INTO bookings (category, seat_name, status) 
SELECT 'PS5', 'PS5-' || i, 'running' 
FROM generate_series(1, 2) AS i;

-- Add VR and Racing as needed...
```

The website will automatically show: **Available = Total - Occupied**

---

## Troubleshooting

**Still showing static data?**
1. Check Vercel logs: Deployments → [Latest] → Runtime Logs
2. Look for database connection errors
3. Make sure DATABASE_URL is correct and saved
4. Make sure you redeployed after adding the environment variable
