// Update handleSubmit function to create incidents when issues are found
const handleSubmit = async () => {
  setLoading(true);
  try {
    // First submit the audit report
    const { data: reportData, error: reportError } = await supabase
      .from('AuditReports')
      .insert([{
        UserEmail: user?.email,
        datacenter: selectedLocation,
        datahall: selectedDataHall,
        issues_reported: hasIssues ? racks.length : 0,
        state: hasIssues ? (racks.length > 2 ? 'Critical' : 'Warning') : 'Healthy',
        walkthrough_id: walkThroughNumber,
        user_full_name: userFullName || user?.email?.split('@')[0] || 'Unknown',
        ReportData: {
          location: selectedLocation,
          datahall: selectedDataHall,
          hasIssues,
          racks,
          walkThroughNumber,
          timestamp: new Date().toISOString()
        }
      }])
      .select();

    if (reportError) throw reportError;

    // If there are issues, create incident records
    if (hasIssues && racks.length > 0) {
      const incidents = racks.map(rack => ({
        location: selectedLocation,
        datahall: selectedDataHall,
        description: generateIncidentDescription(rack),
        severity: determineSeverity(rack),
        status: 'open',
        user_id: user?.id
      }));

      const { error: incidentsError } = await supabase
        .from('incidents')
        .insert(incidents);

      if (incidentsError) throw incidentsError;
    }

    localStorage.setItem('lastWalkThroughNumber', walkThroughNumber.toString());
    
    navigate('/confirmation', { 
      state: { 
        inspectionId: reportData?.[0]?.Id,
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

// Helper function to generate incident description
const generateIncidentDescription = (rack: RackForm) => {
  const issues = [];
  
  if (rack.devices.powerSupplyUnit && rack.psuDetails) {
    issues.push(`PSU ${rack.psuDetails.psuId} at U${rack.psuDetails.uHeight}: ${rack.psuDetails.status}`);
  }
  
  if (rack.devices.powerDistributionUnit && rack.pduDetails) {
    issues.push(`PDU ${rack.pduDetails.pduId}: ${rack.pduDetails.status}`);
  }
  
  if (rack.devices.rearDoorHeatExchanger && rack.rdhxDetails) {
    issues.push(`RDHX: ${rack.rdhxDetails.status}`);
  }

  return `Rack ${rack.location} issues: ${issues.join('; ')}`;
};

// Helper function to determine incident severity
const determineSeverity = (rack: RackForm): 'critical' | 'high' | 'medium' | 'low' => {
  if (rack.devices.powerDistributionUnit && rack.pduDetails?.status === 'Powered-Off') {
    return 'critical';
  }
  
  if (rack.devices.powerSupplyUnit && rack.psuDetails?.status === 'Powered-Off') {
    return 'high';
  }
  
  if (rack.devices.rearDoorHeatExchanger && rack.rdhxDetails?.status === 'Water Leak') {
    return 'critical';
  }
  
  return 'medium';
};

export default determineSeverity