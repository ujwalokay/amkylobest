# Database Security Setup - Read-Only Access

## Why This Is Important
Your current database connection uses an admin account (`neondb_owner`) which has full permissions to read, write, and delete data. If someone hacks this website, they could damage your database.

This guide will help you create a secure read-only database user that can ONLY view data, never modify it.

## Step 1: Create Read-Only Database User

Run these SQL commands in your Neon database console (or any PostgreSQL client):

```sql
-- Create a read-only user
CREATE USER gaming_viewer WITH PASSWORD 'your_secure_password_here';

-- Grant connection permission
GRANT CONNECT ON DATABASE neondb TO gaming_viewer;

-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO gaming_viewer;

-- Grant SELECT permission ONLY on required tables
GRANT SELECT ON device_configs TO gaming_viewer;
GRANT SELECT ON bookings TO gaming_viewer;

-- Ensure the user cannot create, modify, or delete anything
REVOKE CREATE ON SCHEMA public FROM gaming_viewer;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM gaming_viewer;
GRANT SELECT ON device_configs TO gaming_viewer;
GRANT SELECT ON bookings TO gaming_viewer;

-- Prevent future table permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
  REVOKE ALL ON TABLES FROM gaming_viewer;
```

## Step 2: Create Read-Only Connection String

After creating the user, create a new connection string:

```
postgresql://gaming_viewer:your_secure_password_here@your-neon-host/neondb?sslmode=require
```

Replace:
- `your_secure_password_here` with the password you chose
- `your-neon-host` with your Neon database host (from your original connection string)

## Step 3: Update Replit Secret

1. Go to Replit Secrets (the lock icon in the sidebar)
2. Create a NEW secret called `READONLY_DATABASE_URL`
3. Paste the read-only connection string
4. The application will automatically use this secure connection

## Security Benefits

✅ **Read-Only Access**: The user can only SELECT data, never INSERT, UPDATE, or DELETE
✅ **Limited Tables**: Access only to `device_configs` and `bookings` tables
✅ **No Schema Changes**: Cannot create or modify database structure
✅ **Application-Level Security**: Additional code checks block any write attempts
✅ **SSL Required**: Encrypted connection to database

## Testing the Security

After setup, you can test that write operations are blocked by trying to update data - it will fail with a permission error.

## Fallback Safety

If the read-only connection fails, the application will show default availability data instead of crashing.
