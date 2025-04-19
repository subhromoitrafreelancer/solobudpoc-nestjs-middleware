/*
  # Create user locations table

  1. New Tables
    - `user_locations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `location` (geography(POINT), stores lat/long)
      - `accuracy` (float, optional)
      - `location_type` (text, enum of allowed values)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_locations` table
    - Add policy for users to read/write their own location data
*/

-- Create enum for location types
CREATE TYPE location_type AS ENUM ('precise', 'nearby', 'hidden');

-- Create locations table
CREATE TABLE IF NOT EXISTS user_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  location geography(POINT) NOT NULL,
  accuracy float,
  location_type location_type NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for spatial queries
CREATE INDEX IF NOT EXISTS user_locations_location_idx ON user_locations USING GIST (location);

-- Enable RLS
ALTER TABLE user_locations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own location"
  ON user_locations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own location"
  ON user_locations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own location"
  ON user_locations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);