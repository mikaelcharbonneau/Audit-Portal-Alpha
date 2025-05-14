// Keep the existing InspectionForm.tsx content, but update the props interface:

interface InspectionFormProps {
  selectedLocation?: string;
  selectedDataHall?: string;
}

// Update the component to use these props for displaying the location info
// and filtering rack locations based on the selected datahall