import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Spinner
} from 'grommet';
import { FormAdd, StatusWarning } from 'grommet-icons';
import { format } from 'date-fns';
import { StatusCard } from '../components/dashboard/StatusCard';
import { InspectionCard } from '../components/dashboard/InspectionCard';
import { ReportCard } from '../components/dashboard/ReportCard';
import { supabase } from '../lib/supabaseClient';

interface Inspection {
  Id: string;
  UserEmail: string;
  Timestamp: string;
  ReportData: {
    datahall: string;
    status: string;
    isUrgent: boolean;
    temperatureReading: string;
    humidityReading: string;
    [key: string]: any;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/GetInspections');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch inspections: ${response.statusText}`);
      }
      
      const data = await response.json();
      setInspections(data);
    } catch (error: any) {
      console.error('Error fetching inspections:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Count inspections by status
  const statusCounts = {
    operational: 0,
    maintenance: 0,
    alert: 0,
    offline: 0,
  };

  inspections.forEach((inspection) => {
    const status = inspection.ReportData.status?.toLowerCase();
    if (status && status in statusCounts) {
      statusCounts[status as keyof typeof statusCounts]++;
    }
  });

  // Get urgent inspections
  const urgentInspections = inspections.filter(
    (inspection) => inspection.ReportData.isUrgent
  );

  // Get recent inspections (last 5)
  const recentInspections = [...inspections]
    .sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime())
    .slice(0, 5);

  return (
    <Box pad="medium">
      <Box direction="row" justify="between" align="center" margin={{ bottom: 'medium' }}>
        <Heading level={2} margin="none">
          Dashboard
        </Heading>
        <Button
          primary
          label="Start Walkthrough"
          icon={<FormAdd />}
          onClick={() => navigate('/inspection')}
        />
      </Box>

      {loading ? (
        <Box align="center" justify="center" height="medium">
          <Spinner size="medium" />
          <Text margin={{ top: 'small' }}>Loading dashboard data...</Text>
        </Box>
      ) : error ? (
        <Box
          background="status-error"
          pad="medium"
          round="small"
          direction="row"
          gap="small"
          align="center"
          margin={{ bottom: 'medium' }}
        >
          <StatusWarning color="white" />
          <Text color="white">Error loading dashboard data: {error}</Text>
        </Box>
      ) : (
        <>
          <Box margin={{ bottom: 'medium' }}>
            <Heading level={3} margin={{ vertical: 'small' }}>
              Data Hall Status
            </Heading>
            <Grid columns={{ count: 'fit', size: 'small' }} gap="medium">
              <StatusCard
                title="Operational"
                count={statusCounts.operational}
                status="ok"
              />
              <StatusCard
                title="Maintenance"
                count={statusCounts.maintenance}
                status="warning"
              />
              <StatusCard
                title="Alert"
                count={statusCounts.alert}
                status="critical"
              />
              <StatusCard
                title="Offline"
                count={statusCounts.offline}
                status="disabled"
              />
            </Grid>
          </Box>

          <Grid columns={['1/2', '1/2']} gap="medium">
            <Box>
              <Heading level={3} margin={{ vertical: 'small' }}>
                Recent Inspections
              </Heading>
              {recentInspections.length > 0 ? (
                <Box gap="medium">
                  {recentInspections.map((inspection) => (
                    <InspectionCard
                      key={inspection.Id}
                      id={inspection.Id}
                      datahall={inspection.ReportData.datahall}
                      status={inspection.ReportData.status}
                      userEmail={inspection.UserEmail}
                      timestamp={inspection.Timestamp}
                      onClick={() => navigate(`/reports/${inspection.Id}`)}
                    />
                  ))}
                  <Box align="center" margin={{ top: 'small' }}>
                    <Button
                      label="View All Inspections"
                      onClick={() => navigate('/inspections')}
                    />
                  </Box>
                </Box>
              ) : (
                <Box
                  background="light-2"
                  pad="medium"
                  round="small"
                  align="center"
                  justify="center"
                  height="small"
                >
                  <Text>No recent inspections found</Text>
                  <Button
                    margin={{ top: 'small' }}
                    primary
                    label="Start First Walkthrough"
                    icon={<FormAdd />}
                    onClick={() => navigate('/inspection')}
                  />
                </Box>
              )}
            </Box>

            <Box>
              <Heading level={3} margin={{ vertical: 'small' }}>
                Urgent Issues
              </Heading>
              {urgentInspections.length > 0 ? (
                <Box gap="medium">
                  {urgentInspections.slice(0, 5).map((inspection) => (
                    <ReportCard
                      key={inspection.Id}
                      id={inspection.Id}
                      datahall={inspection.ReportData.datahall}
                      status={inspection.ReportData.status}
                      issue={inspection.ReportData.comments || 'Urgent issue flagged'}
                      timestamp={inspection.Timestamp}
                      onClick={() => navigate(`/reports/${inspection.Id}`)}
                    />
                  ))}
                </Box>
              ) : (
                <Box
                  background="light-2"
                  pad="medium"
                  round="small"
                  align="center"
                  justify="center"
                  height="small"
                >
                  <Text>No urgent issues at this time</Text>
                </Box>
              )}
            </Box>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard;
