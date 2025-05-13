import React from 'react';
import { Box, Heading } from 'grommet';
import { InspectionForm } from '../components/inspection/InspectionForm';

const InspectionFlow = () => {
  return (
    <Box pad="medium">
      <Heading level={2} margin={{ top: 'none', bottom: 'medium' }}>
        New Inspection
      </Heading>
      <InspectionForm />
    </Box>
  );
};

export default InspectionFlow;
