import React from 'react';
import { Box, Heading } from 'grommet';
import { InspectionForm } from '../components/inspection/InspectionForm';
import { useLocation } from 'react-router-dom';

interface LocationState {
  selectedLocation?: string;
  selectedDataHall?: string;
}

const InspectionFlow = () => {
  const location = useLocation();
  const { selectedLocation, selectedDataHall } = (location.state as LocationState) || {};

  return (
    <Box pad="medium">
      <Heading level={2} margin={{ top: 'none', bottom: 'medium' }}>
        New Inspection
      </Heading>
      <InspectionForm selectedLocation={selectedLocation} selectedDataHall={selectedDataHall} />
    </Box>
  );
};

export default InspectionFlow;