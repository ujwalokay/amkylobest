-- Use this script to update real-time availability
-- Clear all current bookings and add new ones based on current status

-- Clear existing bookings
TRUNCATE TABLE bookings;

-- Update bookings based on current cafe status
-- Example: Update PC availability (change numbers as needed)
-- For 8/15 available, add 7 running bookings:
INSERT INTO bookings (category, seat_name, status) VALUES
  ('PC', 'PC-1', 'running'),
  ('PC', 'PC-2', 'running'),
  ('PC', 'PC-3', 'running'),
  ('PC', 'PC-4', 'running'),
  ('PC', 'PC-5', 'running'),
  ('PC', 'PC-6', 'running'),
  ('PC', 'PC-7', 'running');

-- For PS5 3/6 available, add 3 running bookings:
INSERT INTO bookings (category, seat_name, status) VALUES
  ('PS5', 'PS5-1', 'running'),
  ('PS5', 'PS5-2', 'running'),
  ('PS5', 'PS5-3', 'running');

-- For VR 3/4 available, add 1 running booking:
INSERT INTO bookings (category, seat_name, status) VALUES
  ('VR', 'VR-1', 'running');

-- Racing Sim: all available (no bookings)
