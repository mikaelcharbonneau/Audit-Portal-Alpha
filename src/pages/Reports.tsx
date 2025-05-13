import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Text,
  Spinner,
  Grid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Meter,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody
} from 'grommet';
import { StatusWarning, FormPrevious, Download } from 'grommet-icons';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';

interface ReportData {
  Id: string;
  UserEmail: string;
  Timestamp: string;
  ReportData: {
    datahall: string;
    status: string;
    isUrgent: boolean;
    temperatureReading: string;
    humidityReading: string;
    comments?: string;
    securityPassed: boolean;
    coolingSystemCheck: boolean;
    [key: string]: any;
  };
}

const Report = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchReport(id);
    }
  }, [id]);

  const fetchReport = async (reportId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/GenerateReport?id=${reportId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch report: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setReport(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch report data');
      }
    } catch (error: any) {
      console.error('Error fetching report:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operational':
        return 'status-ok';
      case 'maintenance':
        return 'status-warning';
      case 'alert':
        return 'status-critical';
      case 'offline':
        return 'status-disabled';
      default:
        return 'status-unknown';
    }
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp < 18) return 'status-warning';
    if (temp > 27) return 'status-critical';
    return 'status-ok';
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity < 30) return 'status-warning';
    if (humidity > 70) return 'status-critical';
    return 'status-ok';
  };

  const downloadReport = () => {
    if (!report) return;
    
    const reportData = JSON.stringify(report, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${report.Id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Box align="center" justify="center" height="medium" pad="large">
        <Spinner size="medium" />
        <Text margin={{ top: 'small' }}>Loading report...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box pad="medium">
        <Button
          icon={<FormPrevious />}
          label="Back to Inspections"
          onClick={() => navigate('/inspections')}
          margin={{ bottom: 'medium' }}
        />
        <Box
          background="status-error"
          pad="medium"
          round="small"
          direction="row"
          gap="small"
          align="center"
        >
          <StatusWarning color="white" />
          <Text color="white">Error loading report: {error}</Text>
        </Box>
      </Box>
    );
  }

  if (!report) {
    return (
      <Box pad="medium">
        <Button
          icon={<FormPrevious />}
          label="Back to Inspections"
          onClick={() => navigate('/inspections')}
          margin={{ bottom: 'medium' }}
        />
        <Box
          background="light-2"
          pad="large"
          round="small"
          align="center"
          justify="center"
          height="medium"
        >
          <Text size="xlarge">Report not found</Text>
          <Text>The requested report could not be found or has been deleted.</Text>
        </Box>
      </Box>
    );
  }

  const temperatureValue = parseFloat(report.ReportData.temperatureReading);
  const humidityValue = parseFloat(report.ReportData.humidityReading);

  return (
    <Box pad="medium">
      <Box direction="row" justify="between" align="center" margin={{ bottom: 'medium' }}>
        <Button
          icon={<FormPrevious />}
          label="Back to Inspections"
          onClick={() => navigate('/inspections')}
        />
        <Button
          icon={<Download />}
          label="Download Report"
          onClick={downloadReport}
          primary
        />
      </Box>

      <Heading level={2}>
        Audit Report - {report.ReportData.datahall}
      </Heading>
      <Text margin={{ bottom: 'medium' }}>
        Generated on {format(new Date(report.Timestamp), 'PPp')}
      </Text>

      <Grid columns={['1/2', '1/2']} gap="medium" margin={{ bottom: 'medium' }}>
        <Card background="light-1" pad="medium">
          <CardHeader>
            <Heading level={3} margin="none">
              General Information
            </Heading>
          </CardHeader>
          <CardBody>
            <Box gap="small">
              <Box direction="row" justify="between">
                <Text weight="bold">Report ID:</Text>
                <Text>{report.Id}</Text>
              </Box>
              <Box direction="row" justify="between">
                <Text weight="bold">Submitted By:</Text>
                <Text>{report.UserEmail}</Text>
              </Box>
              <Box direction="row" justify="between">
                <Text weight="bold">Date & Time:</Text>
                <Text>{format(new Date(report.Timestamp), 'PPp')}</Text>
              </Box>
              <Box direction="row" justify="between">
                <Text weight="bold">Data Hall:</Text>
                <Text>{report.ReportData.datahall}</Text>
              </Box>
              <Box direction="row" justify="between">
                <Text weight="bold">Status:</Text>
                <Box
                  background={getStatusColor(report.ReportData.status)}
                  pad={{ horizontal: 'small', vertical: 'xsmall' }}
                  round="small"
                >
                  <Text size="small">{report.ReportData.status}</Text>
                </Box>
              </Box>
              <Box direction="row" justify="between">
                <Text weight="bold">Marked as Urgent:</Text>
                <Text>{report.ReportData.isUrgent ? 'Yes' : 'No'}</Text>
              </Box>
            </Box>
          </CardBody>
        </Card>

        <Card background="light-1" pad="medium">
          <CardHeader>
            <Heading level={3} margin="none">
              Environmental Readings
            </Heading>
          </CardHeader>
          <CardBody>
            <Box gap="medium" pad={{ vertical: 'small' }}>
              <Box>
                <Text weight="bold" margin={{ bottom: 'xsmall' }}>Temperature</Text>
                <Box align="center" direction="row" gap="small">
                  <Meter
                    type="bar"
                    background="light-2"
                    color={getTemperatureStatus(temperatureValue)}
                    value={temperatureValue}
                    max={40}
                    size="small"
                  />
                  <Text>{temperatureValue}°C</Text>
                </Box>
              </Box>
              <Box>
                <Text weight="bold" margin={{ bottom: 'xsmall' }}>Humidity</Text>
                <Box align="center" direction="row" gap="small">
                  <Meter
                    type="bar"
                    background="light-2"
                    color={getHumidityStatus(humidityValue)}
                    value={humidityValue}
                    max={100}
                    size="small"
                  />
                  <Text>{humidityValue}%</Text>
                </Box>
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Grid>

      <Card background="light-1" pad="medium" margin={{ bottom: 'medium' }}>
        <CardHeader>
          <Heading level={3} margin="none">
            System Checks
          </Heading>
        </CardHeader>
        <CardBody>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell scope="col">
                  <Text weight="bold">Check Item</Text>
                </TableCell>
                <TableCell scope="col">
                  <Text weight="bold">Status</Text>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Text>Security Systems</Text>
                </TableCell>
                <TableCell>
                  <Box
                    background={report.ReportData.securityPassed ? 'status-ok' : 'status-critical'}
                    pad={{ horizontal: 'small', vertical: 'xsmall' }}
                    round="small"
                    width="max-content"
                  >
                    <Text size="small">{report.ReportData.securityPassed ? 'PASSED' : 'FAILED'}</Text>
                  </Box>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Text>Cooling System</Text>
                </TableCell>
                <TableCell>
                  <Box
                    background={report.ReportData.coolingSystemCheck ? 'status-ok' : 'status-critical'}
                    pad={{ horizontal: 'small', vertical: 'xsmall' }}
                    round="small"
                    width="max-content"
                  >
                    <Text size="small">{report.ReportData.coolingSystemCheck ? 'OPERATIONAL' : 'ISSUE DETECTED'}</Text>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {report.ReportData.comments && (
        <Card background="light-1" pad="medium">
          <CardHeader>
            <Heading level={3} margin="none">
              Additional Comments
            </Heading>
          </CardHeader>
          <CardBody>
            <Text>{report.ReportData.comments}</Text>
          </CardBody>
        </Card>
      )}
    </Box>
  );
};

export default Report;
