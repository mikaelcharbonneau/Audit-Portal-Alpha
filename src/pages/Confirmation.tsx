import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Card } from 'grommet';
import { FormCheckmark, StatusCritical } from 'grommet-icons';

interface LocationState {
  inspectionId?: string;
  success: boolean;
  error?: string;
}

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState || { success: false };

  return (
    <Box fill align="center" justify="center" background="light-2">
      <Card 
        width="large" 
        background="white" 
        pad="large" 
        round="small" 
        elevation="small"
      >
        {state.success ? (
          <Box align="center" gap="medium">
            <Box
              background="#01A982"
              pad="medium"
              round="full"
              align="center"
              justify="center"
              width="xsmall"
              height="xsmall"
            >
              <FormCheckmark size="large" color="white" />
            </Box>
            <Box align="center" gap="small">
              <h2 className="text-2xl font-semibold text-gray-900">
                Inspection Submitted Successfully
              </h2>
              <p className="text-gray-600 text-center">
                Your inspection has been recorded and is available for review.
              </p>
            </Box>
            {state.inspectionId && (
              <Box 
                background="light-2" 
                pad="medium" 
                round="small" 
                width="large"
                gap="xsmall"
              >
                <p className="text-sm font-medium text-gray-600">Inspection ID:</p>
                <p className="text-sm font-mono text-gray-900">{state.inspectionId}</p>
              </Box>
            )}
            <Box direction="row" gap="medium" margin={{ top: "medium" }}>
              <button
                onClick={() => navigate(`/reports/${state.inspectionId}`)}
                className="px-6 py-2.5 bg-[#01A982] text-white rounded-md hover:bg-[#018768] transition-colors"
              >
                View Report
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </Box>
          </Box>
        ) : (
          <Box align="center" gap="medium">
            <Box
              background="status-critical"
              pad="medium"
              round="full"
              align="center"
              justify="center"
              width="xsmall"
              height="xsmall"
            >
              <StatusCritical size="large" color="white" />
            </Box>
            <Box align="center" gap="small">
              <h2 className="text-2xl font-semibold text-gray-900">
                Submission Error
              </h2>
              <p className="text-gray-600 text-center">
                There was a problem submitting your inspection. Please try again.
              </p>
            </Box>
            {state.error && (
              <Box 
                background="status-critical"
                pad="medium"
                round="small"
                width="large"
              >
                <p className="text-sm text-white">Error: {state.error}</p>
              </Box>
            )}
            <Box direction="row" gap="medium" margin={{ top: "medium" }}>
              <button
                onClick={() => navigate('/inspection')}
                className="px-6 py-2.5 bg-[#01A982] text-white rounded-md hover:bg-[#018768] transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default Confirmation;