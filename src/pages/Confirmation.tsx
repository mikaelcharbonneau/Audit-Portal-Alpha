import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box } from 'grommet';
import { Check, AlarmPlus as FormPrevious, View as FormView } from 'lucide-react';

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
    <Box fill align="center" justify="center" pad="medium">
      <div className="bg-white rounded-lg shadow-sm p-12 max-w-xl w-full text-center">
        {state.success ? (
          <>
            <div className="mb-8">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Inspection Submitted Successfully
              </h1>
              <p className="text-gray-600">
                Your inspection has been recorded and is available for review.
              </p>
            </div>

            {state.inspectionId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-500 mb-1">Inspection ID:</p>
                <p className="font-mono text-gray-700">{state.inspectionId}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate(`/reports/${state.inspectionId}`)}
                className="px-6 py-2.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors inline-flex items-center gap-2"
              >
                <FormView className="w-4 h-4" />
                View Report
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                <FormPrevious className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-red-500">×</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Submission Error
              </h1>
              <p className="text-gray-600">
                There was a problem submitting your inspection. Please try again.
              </p>
            </div>

            {state.error && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-8">
                <p className="text-sm text-red-600">Error: {state.error}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => navigate('/inspection')}
                className="px-6 py-2.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
              >
                <FormPrevious className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </Box>
  );
};

export default Confirmation;