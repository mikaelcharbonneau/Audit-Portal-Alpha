import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  DataTable,
  Heading,
  Pagination,
  Spinner,
  Text,
  Layer,
  Card
} from 'grommet';
import { FormAdd, FormView, FormTrash, StatusWarning } from 'grommet-icons';
import { format } from 'date-fns';
import { supabase } from '../lib/supabaseClient';

interface Inspection {
  Id: string;
  UserEmail: string;
  Timestamp: string;
  ReportData: {
    datahall: string;
    status: string;
    isUrgent: boolean;
    [key: string]: any;
  };
}

const Inspections = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const pageSize = 10;

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

  const viewReport = (id: string) => {
    navigate(`/reports/${id}`);
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

  const paginatedInspections = inspections.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Box pad="medium" fill>
      <Box direction="row" justify="between" align="center" margin={{ bottom: 'medium' }}>
        <Heading level={2} margin="none">
          Inspections
        </Heading>
        <Button
          primary
          label="New Inspection"
          icon={<FormAdd />}
          onClick={() => navigate('/inspection')}
        />
      </Box>

      {loading ? (
        <Box align="center" justify="center" height="medium">
          <Spinner size="medium" />
          <Text margin={{ top: 'small' }}>Loading inspections...</Text>
        </Box>
      ) : error ? (
        <Box
          background="status-error"
          pad="medium"
          round="small"
          direction="row"
          gap="small"
          align="center"
        >
          <StatusWarning color="white" />
          <Text color="white">Error loading inspections: {error}</Text>
        </Box>
      ) : inspections.length === 0 ? (
        <Box
          background="light-2"
          pad="large"
          round="small"
          align="center"
          justify="center"
          height="medium"
        >
          <Text size="xlarge">No inspections found</Text>
          <Text margin={{ bottom: 'medium' }}>Submit a new inspection to get started</Text>
          <Button
            primary
            label="New Inspection"
            icon={<FormAdd />}
            onClick={() => navigate('/inspection')}
          />
        </Box>
      ) : (
        <>
          <DataTable
            columns={[
              {
                property: 'Id',
                header: <Text weight="bold">ID</Text>,
                render: (data: Inspection) => (
                  <Text size="small">{data.Id.substring(0, 8)}...</Text>
                ),
              },
              {
                property: 'UserEmail',
                header: <Text weight="bold">User Email</Text>,
                render: (data: Inspection) => <Text>{data.UserEmail}</Text>,
              },
              {
                property: 'Timestamp',
                header: <Text weight="bold">Date & Time</Text>,
                render: (data: Inspection) => (
                  <Text>{format(new Date(data.Timestamp), 'PPp')}</Text>
                ),
              },
              {
                property: 'datahall',
                header: <Text weight="bold">Data Hall</Text>,
                render: (data: Inspection) => (
                  <Text>{data.ReportData.datahall}</Text>
                ),
              },
              {
                property: 'status',
                header: <Text weight="bold">Status</Text>,
                render: (data: Inspection) => (
                  <Box
                    background={getStatusColor(data.ReportData.status)}
                    pad={{ horizontal: 'small', vertical: 'xsmall' }}
                    round="small"
                    width="max-content"
                  >
                    <Text size="small">{data.ReportData.status}</Text>
                  </Box>
                ),
              },
              {
                property: 'urgent',
                header: <Text weight="bold">Urgent</Text>,
                render: (data: Inspection) => (
                  <Text>{data.ReportData.isUrgent ? 'Yes' : 'No'}</Text>
                ),
              },
              {
                property: 'actions',
                header: <Text weight="bold">Actions</Text>,
                render: (data: Inspection) => (
                  <Box direction="row" gap="small">
                    <Button
                      icon={<FormView />}
                      tip="View report"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewReport(data.Id);
                      }}
                      plain
                      hoverIndicator
                    />
                  </Box>
                ),
              },
            ]}
            data={paginatedInspections}
            onClickRow={({ datum }) => setSelectedInspection(datum)}
            border={{ side: 'horizontal', color: 'light-3' }}
            background={{
              header: { color: 'light-1' },
              body: ['white', 'light-1'],
            }}
          />

          <Box
            direction="row"
            justify="between"
            align="center"
            margin={{ top: 'medium' }}
          >
            <Text size="small">
              Showing {Math.min(inspections.length, pageSize)} of {inspections.length} inspections
            </Text>
            <Pagination
              numberItems={inspections.length}
              step={pageSize}
              page={page}
              onChange={({ page: nextPage }) => setPage(nextPage)}
            />
          </Box>
        </>
      )}

      {selectedInspection && (
        <Layer
          position="center"
          onEsc={() => setSelectedInspection(null)}
          onClickOutside={() => setSelectedInspection(null)}
        >
          <Card width="large" pad="medium">
            <Box direction="row" justify="between" align="center">
              <Heading level={3} margin="none">
                Inspection Details
              </Heading>
              <Button
                plain
                label="Close"
                onClick={() => setSelectedInspection(null)}
              />
            </Box>
            <Box gap="medium" margin={{ top: 'medium' }}>
              <Box direction="row" gap="medium">
                <Box basis="1/2">
                  <Text weight="bold">ID:</Text>
                  <Text>{selectedInspection.Id}</Text>
                </Box>
                <Box basis="1/2">
                  <Text weight="bold">Date:</Text>
                  <Text>
                    {format(new Date(selectedInspection.Timestamp), 'PPp')}
                  </Text>
                </Box>
              </Box>
              <Box direction="row" gap="medium">
                <Box basis="1/2">
                  <Text weight="bold">User Email:</Text>
                  <Text>{selectedInspection.UserEmail}</Text>
                </Box>
                <Box basis="1/2">
                  <Text weight="bold">Data Hall:</Text>
                  <Text>{selectedInspection.ReportData.datahall}</Text>
                </Box>
              </Box>
              <Box direction="row" gap="medium">
                <Box basis="1/2">
                  <Text weight="bold">Status:</Text>
                  <Box
                    background={getStatusColor(selectedInspection.ReportData.status)}
                    pad={{ horizontal: 'small', vertical: 'xsmall' }}
                    round="small"
                    width="max-content"
                    margin={{ top: 'xsmall' }}
                  >
                    <Text size="small">{selectedInspection.ReportData.status}</Text>
                  </Box>
                </Box>
                <Box basis="1/2">
                  <Text weight="bold">Urgent:</Text>
                  <Text>{selectedInspection.ReportData.isUrgent ? 'Yes' : 'No'}</Text>
                </Box>
              </Box>
              {selectedInspection.ReportData.comments && (
                <Box>
                  <Text weight="bold">Comments:</Text>
                  <Text>{selectedInspection.ReportData.comments}</Text>
                </Box>
              )}
              <Box direction="row" gap="small" margin={{ top: 'medium' }}>
                <Button
                  primary
                  label="View Full Report"
                  onClick={() => {
                    setSelectedInspection(null);
                    viewReport(selectedInspection.Id);
                  }}
                />
                <Button
                  label="Close"
                  onClick={() => setSelectedInspection(null)}
                />
              </Box>
            </Box>
          </Card>
        </Layer>
      )}
    </Box>
  );
};

export default Inspections;
