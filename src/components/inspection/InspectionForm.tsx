import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Heading, Text, CheckBox, TextArea } from 'grommet';
import { ChevronDown, ChevronUp, Server } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface RackForm {
  id: string;
  location: string;
  devices: {
    powerSupplyUnit: boolean;
    powerDistributionUnit: boolean;
    rearDoorHeatExchanger: boolean;
  };
  psuDetails?: {
    status: string;
    psuId: string;
    uHeight: string;
    comments?: string;
  };
  pduDetails?: {
    status: string;
    pduId: string;
    comments?: string;
  };
  rdhxDetails?: {
    status: string;
    comments?: string;
  };
}

interface LocationState {
  selectedDataHall?: string;
}

const psuStatusOptions = ['Healthy', 'Amber LED', 'Powered-Off', 'Other'];
const psuIdOptions = ['PSU 1', 'PSU 2', 'PSU 3', 'PSU 4', 'PSU 5', 'PSU 6'];
const uHeightOptions = Array.from({ length: 49 }, (_, i) => `U${i}`);

export const InspectionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedDataHall } = (location.state as LocationState) || {};
  const [loading, setLoading] = useState(false);
  const [hasIssues, setHasIssues] = useState<boolean | null>(null);
  const [racks, setRacks] = useState<RackForm[]>([]);
  const [expandedRacks, setExpandedRacks] = useState<string[]>([]);

  const toggleRackExpansion = (rackId: string) => {
    setExpandedRacks(prev => 
      prev.includes(rackId) 
        ? prev.filter(id => id !== rackId)
        : [...prev, rackId]
    );
  };

  const addRack = () => {
    const newRack: RackForm = {
      id: `rack-${Date.now()}`,
      location: '',
      devices: {
        powerSupplyUnit: false,
        powerDistributionUnit: false,
        rearDoorHeatExchanger: false
      }
    };
    setRacks([...racks, newRack]);
    setExpandedRacks([...expandedRacks, newRack.id]);
  };

  const updateRack = (rackId: string, updates: Partial<RackForm>) => {
    setRacks(racks.map(rack => 
      rack.id === rackId ? { ...rack, ...updates } : rack
    ));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('AuditReports')
        .insert([{
          UserEmail: 'user@example.com', // This should come from auth context
          ReportData: {
            datahall: selectedDataHall,
            hasIssues,
            racks,
            timestamp: new Date().toISOString()
          }
        }])
        .select();

      if (error) throw error;
      
      navigate('/confirmation', { 
        state: { 
          inspectionId: data?.[0]?.Id,
          success: true 
        } 
      });
    } catch (error: any) {
      console.error('Error submitting inspection:', error);
      navigate('/confirmation', { 
        state: { 
          success: false,
          error: error.message 
        } 
      });
    } finally {
      setLoading(false);
    }
  };

  if (hasIssues === null) {
    return (
      <Box pad="medium">
        <Heading level={2} margin={{ bottom: 'medium' }}>
          Inspection Walkthrough
        </Heading>
        <Text margin={{ bottom: 'medium' }}>Location: {selectedDataHall}</Text>
        
        <Box margin={{ bottom: 'medium' }}>
          <Text margin={{ bottom: 'medium' }}>
            Have you discovered any issues during the walkthrough?
          </Text>
          <Box direction="row" gap="medium">
            <Button 
              primary
              color="status-critical"
              label="Yes, I found issues"
              onClick={() => setHasIssues(true)}
            />
            <Button
              primary
              color="status-ok"
              label="No issues found"
              onClick={() => setHasIssues(false)}
            />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box pad="medium">
      <Heading level={2} margin={{ bottom: 'medium' }}>
        Inspection Walkthrough
      </Heading>
      <Text margin={{ bottom: 'medium' }}>Location: {selectedDataHall}</Text>

      {racks.map((rack, index) => (
        <Box
          key={rack.id}
          background="light-1"
          round="small"
          margin={{ bottom: 'medium' }}
          pad="medium"
        >
          <Box
            direction="row"
            align="center"
            justify="between"
            onClick={() => toggleRackExpansion(rack.id)}
            style={{ cursor: 'pointer' }}
          >
            <Box direction="row" align="center" gap="small">
              <Server size={20} />
              <Text weight="bold">Rack: {rack.location || `#${index + 1}`}</Text>
            </Box>
            {expandedRacks.includes(rack.id) ? <ChevronUp /> : <ChevronDown />}
          </Box>

          {expandedRacks.includes(rack.id) && (
            <Box margin={{ top: 'medium' }} gap="medium">
              <Box>
                <Text margin={{ bottom: 'xsmall' }}>Rack Location</Text>
                <input
                  type="text"
                  value={rack.location}
                  onChange={(e) => updateRack(rack.id, { location: e.target.value })}
                  className="form-input"
                  placeholder="Enter rack location"
                />
              </Box>

              <Box>
                <Text margin={{ bottom: 'xsmall' }}>Select Impacted Device(s)</Text>
                <Box gap="small">
                  <CheckBox
                    label="Power Supply Unit"
                    checked={rack.devices.powerSupplyUnit}
                    onChange={(e) => updateRack(rack.id, {
                      devices: { ...rack.devices, powerSupplyUnit: e.target.checked }
                    })}
                  />
                  <CheckBox
                    label="Power Distribution Unit"
                    checked={rack.devices.powerDistributionUnit}
                    onChange={(e) => updateRack(rack.id, {
                      devices: { ...rack.devices, powerDistributionUnit: e.target.checked }
                    })}
                  />
                  <CheckBox
                    label="Rear Door Heat Exchanger"
                    checked={rack.devices.rearDoorHeatExchanger}
                    onChange={(e) => updateRack(rack.id, {
                      devices: { ...rack.devices, rearDoorHeatExchanger: e.target.checked }
                    })}
                  />
                </Box>
              </Box>

              {rack.devices.powerSupplyUnit && (
                <Box background="light-2" pad="medium" round="small">
                  <Text weight="bold" margin={{ bottom: 'medium' }}>Power Supply Unit</Text>
                  <Box gap="medium">
                    <Box>
                      <Text margin={{ bottom: 'xsmall' }}>Issue Description</Text>
                      <select
                        value={rack.psuDetails?.status || ''}
                        onChange={(e) => updateRack(rack.id, {
                          psuDetails: { ...rack.psuDetails, status: e.target.value }
                        })}
                        className="form-input"
                      >
                        <option value="">Select PSU status</option>
                        {psuStatusOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </Box>

                    <Box>
                      <Text margin={{ bottom: 'xsmall' }}>PSU ID</Text>
                      <select
                        value={rack.psuDetails?.psuId || ''}
                        onChange={(e) => updateRack(rack.id, {
                          psuDetails: { ...rack.psuDetails, psuId: e.target.value }
                        })}
                        className="form-input"
                      >
                        <option value="">Select PSU</option>
                        {psuIdOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </Box>

                    <Box>
                      <Text margin={{ bottom: 'xsmall' }}>Device U-Height</Text>
                      <select
                        value={rack.psuDetails?.uHeight || ''}
                        onChange={(e) => updateRack(rack.id, {
                          psuDetails: { ...rack.psuDetails, uHeight: e.target.value }
                        })}
                        className="form-input"
                      >
                        <option value="">Select U-Height</option>
                        {uHeightOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </Box>

                    <Box>
                      <Text margin={{ bottom: 'xsmall' }}>Additional Comments (Optional)</Text>
                      <TextArea
                        value={rack.psuDetails?.comments || ''}
                        onChange={(e) => updateRack(rack.id, {
                          psuDetails: { ...rack.psuDetails, comments: e.target.value }
                        })}
                        placeholder="Add any additional comments"
                      />
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Similar sections for PDU and RDHX would go here */}
            </Box>
          )}
        </Box>
      ))}

      <Box margin={{ vertical: 'medium' }}>
        <Button
          label="Add Another Rack"
          onClick={addRack}
          plain
          color="brand"
        />
      </Box>

      <Box direction="row" gap="medium" margin={{ top: 'large' }}>
        <Button
          label="Cancel"
          onClick={() => navigate('/')}
        />
        <Button
          primary
          label={loading ? 'Submitting...' : 'Complete Walkthrough'}
          onClick={handleSubmit}
          disabled={loading || racks.length === 0}
        />
      </Box>
    </Box>
  );
};