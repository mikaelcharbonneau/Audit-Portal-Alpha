/*
  # Create incidents view from audit reports

  1. New View
    - Creates a view that extracts incident information from audit reports
    - Transforms JSON data into queryable columns
    - Includes all relevant incident details

  2. Security
    - Enable RLS on the view
    - Add policy for authenticated users to read incidents
*/

-- Create view to extract incidents from audit reports
CREATE VIEW incidents AS
SELECT 
  ar.id,
  ar.datacenter as location,
  ar.datahall,
  rd->>'description' as description,
  CASE
    WHEN (rd->>'issues_reported')::int > 2 THEN 'critical'::incident_severity
    WHEN (rd->>'issues_reported')::int > 0 THEN 'high'::incident_severity
    ELSE 'low'::incident_severity
  END as severity,
  CASE
    WHEN ar.state = 'Critical' THEN 'open'::incident_status
    WHEN ar.state = 'Warning' THEN 'in-progress'::incident_status
    ELSE 'resolved'::incident_status
  END as status,
  ar.timestamp as created_at,
  ar.timestamp as updated_at,
  ar.user_id
FROM 
  "AuditReports" ar,
  jsonb_array_elements(ar."ReportData"->'racks') as rd
WHERE 
  (rd->>'devices')::jsonb ? 'powerSupplyUnit' 
  OR (rd->>'devices')::jsonb ? 'powerDistributionUnit'
  OR (rd->>'devices')::jsonb ? 'rearDoorHeatExchanger';

-- Enable RLS
ALTER VIEW incidents SET (security_invoker = true);

-- Add RLS policies
CREATE POLICY "Users can read all incidents"
  ON incidents
  FOR SELECT
  TO authenticated
  USING (true);