-- =====================================================
-- Create Read-Only Database User (MAXIMUM SECURITY)
-- =====================================================
-- Run this in your database console (Neon, Supabase, etc.)

-- 1. Create read-only user
CREATE USER cafe_readonly WITH PASSWORD 'CHANGE_ME_TO_STRONG_PASSWORD';

-- 2. Grant minimal permissions
GRANT CONNECT ON DATABASE neondb TO cafe_readonly;
GRANT USAGE ON SCHEMA public TO cafe_readonly;

-- 3. Grant SELECT only on specific tables
GRANT SELECT ON device_configs TO cafe_readonly;
GRANT SELECT ON bookings TO cafe_readonly;

-- 4. Prevent all write operations
REVOKE CREATE ON SCHEMA public FROM cafe_readonly;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public FROM cafe_readonly;

-- 5. Test the user (these should FAIL)
-- SET ROLE cafe_readonly;
-- DELETE FROM bookings WHERE id = 1;  -- Should ERROR
-- UPDATE device_configs SET count = 999;  -- Should ERROR

-- 6. Verify permissions (should show only SELECT)
SELECT 
    grantee, 
    table_name, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE grantee = 'cafe_readonly';

-- =====================================================
-- Your new READONLY_DATABASE_URL will be:
-- postgresql://cafe_readonly:PASSWORD@HOST:PORT/DATABASE?sslmode=require
-- =====================================================
