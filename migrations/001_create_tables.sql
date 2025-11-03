-- Create device_configs table to store gaming station configurations
CREATE TABLE IF NOT EXISTS device_configs (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  count INTEGER NOT NULL,
  seats JSONB
);

-- Create bookings table to track active gaming sessions
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  seat_name TEXT NOT NULL,
  status TEXT NOT NULL,
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial device configurations
INSERT INTO device_configs (id, category, count, seats) VALUES
  ('pc', 'PC', 15, '[]'),
  ('ps5', 'PS5', 6, '[]'),
  ('vr', 'VR', 4, '[]'),
  ('racing', 'Racing Sim', 2, '[]')
ON CONFLICT (id) DO NOTHING;

-- Insert sample bookings to show current availability
-- PC: 7 occupied out of 15 (8 available)
INSERT INTO bookings (category, seat_name, status) VALUES
  ('PC', 'PC-1', 'running'),
  ('PC', 'PC-2', 'running'),
  ('PC', 'PC-3', 'running'),
  ('PC', 'PC-4', 'running'),
  ('PC', 'PC-5', 'running'),
  ('PC', 'PC-6', 'running'),
  ('PC', 'PC-7', 'running');

-- PS5: 3 occupied out of 6 (3 available)
INSERT INTO bookings (category, seat_name, status) VALUES
  ('PS5', 'PS5-1', 'running'),
  ('PS5', 'PS5-2', 'running'),
  ('PS5', 'PS5-3', 'running');

-- VR: 1 occupied out of 4 (3 available)
INSERT INTO bookings (category, seat_name, status) VALUES
  ('VR', 'VR-1', 'running');

-- Racing Sim: 0 occupied out of 2 (2 available) - no bookings
