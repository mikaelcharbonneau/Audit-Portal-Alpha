/*
  # Create incidents view
  
  1. Changes
    - Drop existing incidents table/view if present
    - Create custom enum types for incident severity and status
    - Create view to extract incidents from audit reports
    - Enable RLS and grant permissions
  
  2. Security
    - Enable RLS on the view
    - Grant SELECT permissions to authenticated users
*/

-- Drop any existing incidents objects
DROP VIEW IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;

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
CREATE VIEW incidents AS
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

-- Grant permissions
GRANT SELECT ON incidents TO authenticated;