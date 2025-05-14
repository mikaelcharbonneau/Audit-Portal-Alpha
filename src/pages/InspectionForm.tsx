import React, { useState } from 'react';
import { Box, Heading } from 'grommet';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { datahallsByLocation } from '../utils/locationMapping';
import { InspectionForm as InspectionFormComponent } from '../components/inspection/InspectionForm';

interface LocationState {
  selectedLocation?: string;
}

const InspectionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedLocation } = (location.state as LocationState) || {};
  const [selectedDataHall, setSelectedDataHall] = useState<string>('');
  const [showDatahallDropdown, setShowDatahallDropdown] = useState(false);

  if (!selectedLocation) {
    navigate('/');
    return null;
  }

  const datahalls = datahallsByLocation[selectedLocation] || [];

  return (
    <Box pad="medium">
      <Heading level={2} margin={{ top: 'none', bottom: 'medium' }}>
        New Inspection
      </Heading>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
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
        </div>

        {selectedDataHall && (
          <InspectionFormComponent 
            selectedLocation={selectedLocation}
            selectedDataHall={selectedDataHall}
          />
        )}
      </div>
    </Box>
  );
};

export default InspectionForm;