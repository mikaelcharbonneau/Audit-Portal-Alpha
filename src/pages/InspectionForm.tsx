import React from 'react';
import { Box, Heading } from 'grommet';
import { useLocation, useNavigate } from 'react-router-dom';
import { InspectionForm as InspectionFormComponent } from '../components/inspection/InspectionForm';

interface LocationState {
  selectedLocation?: string;
  selectedDataHall?: string;
}

const InspectionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedLocation, selectedDataHall } = (location.state as LocationState) || {};

  if (!selectedLocation || !selectedDataHall) {
    navigate('/');
    return null;
  }

  return (
    <Box pad="medium">
      <Heading level={2} margin={{ top: 'none', bottom: 'medium' }}>
        New Inspection
      </Heading>
      <InspectionFormComponent 
        selectedLocation={selectedLocation}
        selectedDataHall={selectedDataHall}
      />
    </Box>
  );
};

export default InspectionForm;