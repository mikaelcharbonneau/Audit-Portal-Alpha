import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Form,
  FormField,
  TextInput,
  Button,
  Select,
  TextArea,
  CheckBox,
  Heading,
  Text,
  Grid,
  Spinner
} from 'grommet';
import { FormNext } from 'grommet-icons';

const dataHallOptions = ['Hall A', 'Hall B', 'Hall C', 'Hall D'];
const statusOptions = ['Operational', 'Maintenance', 'Alert', 'Offline'];

export const InspectionForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    userEmail: '',
    datahall: '',
    status: '',
    temperatureReading: '',
    humidityReading: '',
    comments: '',
    isUrgent: false,
    securityPassed: true,
    coolingSystemCheck: true
  });

  const handleSubmit = async ({ value }: { value: any }) => {
    setLoading(true);
    try {
      const response = await fetch('/api/SubmitInspection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: value.userEmail,
          datahall: value.datahall,
          status: value.status,
          temperatureReading: value.temperatureReading,
          humidityReading: value.humidityReading,
          comments: value.comments,
          isUrgent: value.isUrgent,
          securityPassed: value.securityPassed,
          coolingSystemCheck: value.coolingSystemCheck
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit inspection');
      }

      const data = await response.json();
      
      navigate('/confirmation', { 
        state: { 
          inspectionId: data.data?.Id,
          success: true 
        } 
      });
    } catch (error: any) {
      console.error('Error submitting inspection:', error);
      navigate('/confirmation', { 
        state: { 
          success: false,
          error: error.message || 'Failed to submit inspection'
        } 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box align="center" justify="center" height="medium">
        <Spinner size="medium" />
        <Text margin={{ top: 'small' }}>Submitting inspection...</Text>
      </Box>
    );
  }

  return (
    <Box pad="medium" background="light-2" round="small">
      <Heading level={2} margin={{ top: 'none', bottom: 'medium' }}>Submit New Inspection</Heading>
      <Text margin={{ bottom: 'medium' }}>Please fill out all required fields below.</Text>
      
      <Form
        value={formValues}
        onChange={nextValue => setFormValues(nextValue)}
        onSubmit={handleSubmit}
        validate="submit"
      >
        <Grid columns={['1/2', '1/2']} gap="medium">
          <FormField name="userEmail" label="Email" required>
            <TextInput 
              name="userEmail" 
              type="email" 
              placeholder="your.email@hpe.com" 
            />
          </FormField>
          
          <FormField name="datahall" label="Data Hall" required>
            <Select
              name="datahall"
              options={dataHallOptions}
              placeholder="Select Data Hall"
            />
          </FormField>
          
          <FormField name="status" label="Status" required>
            <Select
              name="status"
              options={statusOptions}
              placeholder="Select Status"
            />
          </FormField>
          
          <FormField name="temperatureReading" label="Temperature (°C)" required>
            <TextInput 
              name="temperatureReading" 
              type="number" 
              step="0.1"
              placeholder="e.g. 22.5" 
            />
          </FormField>
          
          <FormField name="humidityReading" label="Humidity (%)" required>
            <TextInput 
              name="humidityReading" 
              type="number"
              step="0.1"
              placeholder="e.g. 45.0" 
            />
          </FormField>
        </Grid>
        
        <FormField name="comments" label="Additional Comments">
          <TextArea 
            name="comments" 
            placeholder="Enter any additional observations or concerns here"
            rows={5}
          />
        </FormField>
        
        <Box margin={{ vertical: 'medium' }} gap="small">
          <CheckBox
            name="isUrgent"
            label="Mark as urgent"
          />
          
          <CheckBox
            name="securityPassed"
            label="Security checks passed"
            checked={formValues.securityPassed}
          />
          
          <CheckBox
            name="coolingSystemCheck"
            label="Cooling system operational"
            checked={formValues.coolingSystemCheck}
          />
        </Box>
        
        <Box direction="row" gap="medium" margin={{ top: 'medium' }}>
          <Button 
            type="submit" 
            primary 
            label={loading ? 'Submitting...' : 'Submit Inspection'} 
            disabled={loading}
            icon={<FormNext />}
            reverse
          />
          <Button 
            label="Cancel" 
            onClick={() => navigate('/')} 
          />
        </Box>
      </Form>
    </Box>
  );
};