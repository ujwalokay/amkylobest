# Database Setup Instructions

## Step 1: Run Initial Setup (One Time Only)

Run this SQL script in your Neon database console to create the tables:

**File:** `001_create_tables.sql`

This will:
- Create `device_configs` table (gaming station types and total capacity)
- Create `bookings` table (active gaming sessions)
- Insert initial data showing 8/15 PC and 3/6 PS5 available

## Step 2: Update Real-Time Availability

Whenever availability changes in your cafe, run this SQL script:

**File:** `002_update_availability.sql`

Edit the script to match current occupancy:
- For each occupied station, add a row with `status = 'running'`
- The app will automatically calculate: Available = Total - Running

## How to Run SQL Scripts in Neon

1. Go to your Neon dashboard (https://console.neon.tech/)
2. Select your database
3. Click on "SQL Editor"
4. Copy and paste the SQL from `001_create_tables.sql`
5. Click "Run" to execute

## Quick Update Examples

**To make 5 PCs available (10 occupied):**
```sql
TRUNCATE TABLE bookings;
-- Add 10 bookings for PC
INSERT INTO bookings (category, seat_name, status) 
SELECT 'PC', 'PC-' || i, 'running' 
FROM generate_series(1, 10) AS i;
```

**To make all PS5 available (0 occupied):**
```sql
DELETE FROM bookings WHERE category = 'PS5';
```

**To make only 1 VR available (3 occupied):**
```sql
DELETE FROM bookings WHERE category = 'VR';
INSERT INTO bookings (category, seat_name, status) VALUES
  ('VR', 'VR-1', 'running'),
  ('VR', 'VR-2', 'running'),
  ('VR', 'VR-3', 'running');
```

## Verify Your Setup

After running the scripts, refresh your website. You should see real-time availability based on the database data!
