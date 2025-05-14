import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

interface LocationState {
  inspectionId?: string;
  success: boolean;
  error?: string;
}

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState || { success: false };

  if (!state.success) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-lg w-full">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Inspection Submitted Successfully
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your inspection has been recorded and is available for review.
          </p>

          {state.inspectionId && (
            <div className="w-full bg-gray-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-500 mb-1">Inspection ID:</p>
              <p className="font-mono text-gray-900">{state.inspectionId}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/reports/${state.inspectionId}`)}
              className="px-6 py-2.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              View Report
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;