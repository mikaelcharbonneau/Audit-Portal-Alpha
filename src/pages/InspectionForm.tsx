import React, { useState } from 'react';
import { Box, Heading } from 'grommet';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { datahallsByLocation } from '../utils/locationMapping';

interface LocationState {
  selectedLocation?: string;
}

const InspectionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedLocation } = (location.state as LocationState) || {};
  const [selectedDataHall, setSelectedDataHall] = useState<string>('');
  const [showDatahallDropdown, setShowDatahallDropdown] = useState(false);
  const [hasIssues, setHasIssues] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  if (!selectedLocation) {
    navigate('/');
    return null;
  }

  const datahalls = datahallsByLocation[selectedLocation] || [];

  const handleSubmit = async () => {
    setLoading(true);
    // Submit logic here
    setTimeout(() => {
      navigate('/confirmation', { 
        state: { 
          success: true 
        } 
      });
    }, 1000);
  };

  return (
    <Box pad="medium">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-4">New Inspection</h1>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Location Details</h2>
            <p className="text-gray-600 mb-4">Location: {selectedLocation}</p>
            
            <div className="relative mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Data Hall
              </label>
              <button
                onClick={() => setShowDatahallDropdown(!showDatahallDropdown)}
                className="w-full bg-white border border-gray-300 px-4 py-2 rounded-lg flex items-center justify-between hover:border-emerald-500 transition-colors"
              >
                <span className="text-gray-700">
                  {selectedDataHall || 'Select Data Hall'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDatahallDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showDatahallDropdown && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg py-1 z-50">
                  {datahalls.map((datahall) => (
                    <button
                      key={datahall}
                      onClick={() => {
                        setSelectedDataHall(datahall);
                        setShowDatahallDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      {datahall}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium mb-4">
                Have you discovered any issues during the walkthrough?
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setHasIssues(true)}
                  className={`px-6 py-2.5 rounded-md transition-colors ${
                    hasIssues === true 
                      ? 'bg-red-500 text-white' 
                      : 'border border-red-500 text-red-500 hover:bg-red-50'
                  }`}
                >
                  Yes, I found issues
                </button>
                <button
                  onClick={() => setHasIssues(false)}
                  className={`px-6 py-2.5 rounded-md transition-colors ${
                    hasIssues === false 
                      ? 'bg-emerald-500 text-white' 
                      : 'border border-emerald-500 text-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  No issues found
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto flex justify-end gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel Audit
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || hasIssues === null}
              className="px-6 py-2.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Complete Audit'}
            </button>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default InspectionForm;