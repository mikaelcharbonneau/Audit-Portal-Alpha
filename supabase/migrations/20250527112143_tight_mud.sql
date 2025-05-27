/*
  # Create incidents table and relationships
  
  1. New Tables
    - `incidents`
      - `id` (uuid, primary key)
      - `location` (text)
      - `datahall` (text) 
      - `description` (text)
      - `severity` (incident_severity)
      - `status` (incident_status)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `user_id` (uuid, foreign key to users)

  2. Security
    - Enable RLS on incidents table
    - Add policies for authenticated users to:
      - Read all incidents
      - Create new incidents
      - Update their own incidents
*/

-- Create custom types if they don't exist
DO $$ BEGIN
    CREATE TYPE incident_severity AS ENUM ('critical', 'high', 'medium', 'low');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE incident_status AS ENUM ('open', 'in-progress', 'resolved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    location text NOT NULL,
    datahall text NOT NULL,
    description text NOT NULL,
    severity incident_severity NOT NULL,
    status incident_status NOT NULL DEFAULT 'open',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    user_id uuid REFERENCES auth.users(id)
);

-- Create updated_at trigger
CREATE TRIGGER set_incidents_updated_at
    BEFORE UPDATE ON incidents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all incidents"
    ON incidents
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can create incidents"
    ON incidents
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own incidents"
    ON incidents
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);