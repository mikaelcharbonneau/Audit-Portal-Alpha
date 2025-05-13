import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Text, TextArea } from 'grommet';
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

  return (
    <Box pad="medium">
      <Text size="xlarge" weight="bold" margin={{ bottom: 'medium' }}>
        New Inspection
      </Text>
      
      <Text size="large" margin={{ bottom: 'small' }}>
        Inspection Walkthrough
      </Text>
      
      <Text margin={{ bottom: 'medium' }}>
        Location: {selectedDataHall}
      </Text>

      {hasIssues === null ? (
        <Box margin={{ bottom: 'medium' }}>
          <Text margin={{ bottom: 'medium' }}>
            Have you discovered any issues during the walkthrough?
          </Text>
          <Box direction="row" gap="medium">
            <button
              onClick={() => setHasIssues(true)}
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Yes, I found issues
            </button>
            <button
              onClick={() => setHasIssues(false)}
              className="px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              No issues found
            </button>
          </Box>
        </Box>
      ) : (
        <>
          {racks.map((rack, index) => (
            <Box
              key={rack.id}
              background="white"
              round="small"
              margin={{ bottom: 'medium' }}
              border={{ color: 'light-3', size: '1px' }}
            >
              <Box
                direction="row"
                align="center"
                justify="between"
                pad="medium"
                onClick={() => toggleRackExpansion(rack.id)}
                style={{ cursor: 'pointer' }}
              >
                <Box direction="row" align="center" gap="small">
                  <Server size={20} className="text-gray-600" />
                  <Text>Rack: #{index + 1}</Text>
                </Box>
                {expandedRacks.includes(rack.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </Box>

              {expandedRacks.includes(rack.id) && (
                <Box pad="medium" border={{ side: 'top', color: 'light-3', size: '1px' }}>
                  <Box margin={{ bottom: 'medium' }}>
                    <Text margin={{ bottom: 'xsmall' }}>Rack Location</Text>
                    <input
                      type="text"
                      value={rack.location}
                      onChange={(e) => updateRack(rack.id, { location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter rack location"
                    />
                  </Box>

                  <Box margin={{ bottom: 'medium' }}>
                    <Text margin={{ bottom: 'xsmall' }}>Select Impacted Device(s)</Text>
                    <Box gap="small">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rack.devices.powerSupplyUnit}
                          onChange={(e) => updateRack(rack.id, {
                            devices: { ...rack.devices, powerSupplyUnit: e.target.checked }
                          })}
                          className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                        />
                        <span>Power Supply Unit</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rack.devices.powerDistributionUnit}
                          onChange={(e) => updateRack(rack.id, {
                            devices: { ...rack.devices, powerDistributionUnit: e.target.checked }
                          })}
                          className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                        />
                        <span>Power Distribution Unit</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rack.devices.rearDoorHeatExchanger}
                          onChange={(e) => updateRack(rack.id, {
                            devices: { ...rack.devices, rearDoorHeatExchanger: e.target.checked }
                          })}
                          className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                        />
                        <span>Rear Door Heat Exchanger</span>
                      </label>
                    </Box>
                  </Box>

                  {rack.devices.powerSupplyUnit && (
                    <Box margin={{ bottom: 'medium' }}>
                      <Text weight="bold" margin={{ bottom: 'small' }}>Power Supply Unit</Text>
                      <Box gap="medium">
                        <Box>
                          <Text margin={{ bottom: 'xsmall' }}>Issue Description</Text>
                          <select
                            value={rack.psuDetails?.status || ''}
                            onChange={(e) => updateRack(rack.id, {
                              psuDetails: { ...rack.psuDetails, status: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="">Select U-Height</option>
                            {uHeightOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        </Box>

                        <Box>
                          <Text margin={{ bottom: 'xsmall' }}>Additional Comments (Optional)</Text>
                          <textarea
                            value={rack.psuDetails?.comments || ''}
                            onChange={(e) => updateRack(rack.id, {
                              psuDetails: { ...rack.psuDetails, comments: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
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

          <button
            onClick={addRack}
            className="w-full py-2 text-emerald-600 border border-emerald-600 rounded-md hover:bg-emerald-50 transition-colors mb-6"
          >
            Add Another Rack
          </button>

          <Box direction="row" gap="medium">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || racks.length === 0}
              className="px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Complete Walkthrough'}
            </button>
          </Box>
        </>
      )}
    </Box>
  );
};