/*
  # Create walkthrough_users table

  1. New Tables
    - `walkthrough_users`
      - `id` (uuid, primary key)
      - `name` (text, nullable)
      - `email` (text, unique, not null)
      - `role` (text, default 'user')
      - `avatar_url` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `walkthrough_users` table
    - Add policies for:
      - Users can read their own profile
      - Users can update their own profile

  3. Triggers
    - Add trigger to update `updated_at` column on record updates
*/

-- Create the walkthrough_users table
CREATE TABLE IF NOT EXISTS public.walkthrough_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL UNIQUE,
  role text DEFAULT 'user',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.walkthrough_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON public.walkthrough_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.walkthrough_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create updated_at trigger function if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    CREATE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  END IF;
END $$;

-- Create the trigger
CREATE TRIGGER update_walkthrough_users_updated_at
  BEFORE UPDATE ON public.walkthrough_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();