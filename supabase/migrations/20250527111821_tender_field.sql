/*
  # Fix incidents view
  
  1. Changes
    - Create incidents view that extracts issues from audit reports
    - Add proper user_id handling using UserEmail
    - Enable RLS with appropriate policies
    
  2. Security
    - Enable RLS on the view
    - Add policy for authenticated users to read incidents
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

-- Create view to extract incidents from audit reports
CREATE OR REPLACE VIEW incidents AS
SELECT 
  ar."Id" as id,
  ar.datacenter as location,
  ar.datahall,
  COALESCE(rd->>'description', 'No description provided') as description,
  CASE
    WHEN ar.issues_reported > 2 THEN 'critical'::incident_severity
    WHEN ar.issues_reported > 0 THEN 'high'::incident_severity
    ELSE 'low'::incident_severity
  END as severity,
  CASE
    WHEN ar.state = 'Critical' THEN 'open'::incident_status
    WHEN ar.state = 'Warning' THEN 'in-progress'::incident_status
    ELSE 'resolved'::incident_status
  END as status,
  ar."Timestamp" as created_at,
  ar."Timestamp" as updated_at,
  ar."UserEmail" as user_email
FROM 
  "AuditReports" ar,
  jsonb_array_elements(ar."ReportData"->'racks') as rd
WHERE 
  ar.issues_reported > 0
  AND (
    (rd->>'devices')::jsonb ? 'powerSupplyUnit' 
    OR (rd->>'devices')::jsonb ? 'powerDistributionUnit'
    OR (rd->>'devices')::jsonb ? 'rearDoorHeatExchanger'
  );

-- Enable RLS
ALTER VIEW incidents SET (security_invoker = true);

-- Add RLS policies
CREATE POLICY "Users can read all incidents"
  ON incidents
  FOR SELECT
  TO authenticated
  USING (true);