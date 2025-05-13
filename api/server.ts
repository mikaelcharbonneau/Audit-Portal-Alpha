// This file is for reference only and is not used in the actual API endpoints
// The API endpoints now use Supabase directly

import { supabase } from './db';

// Example server functionality - not currently used
export const getAuditReports = async () => {
  try {
    const { data, error } = await supabase
      .from('AuditReports')
      .select('*')
      .order('Timestamp', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error fetching audit reports:', error.message);
    throw error;
  }
};

export const getAuditReportById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('AuditReports')
      .select('*')
      .eq('Id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error(`Error fetching audit report ${id}:`, error.message);
    throw error;
  }
};

export const createAuditReport = async (userEmail: string, reportData: any) => {
  try {
    const { data, error } = await supabase
      .from('AuditReports')
      .insert([
        { 
          UserEmail: userEmail,
          ReportData: reportData
        }
      ])
      .select();
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error creating audit report:', error.message);
    throw error;
  }
};
