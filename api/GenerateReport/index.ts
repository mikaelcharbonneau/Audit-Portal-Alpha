import { supabase } from "../db";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return res.json({ 
      success: false, 
      message: "Report ID is required" 
    });
  }

  try {
    const { data, error } = await supabase
      .from('AuditReports')
      .select('*')
      .eq('Id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.json({ 
          success: false, 
          message: "Report not found" 
        });
      }
      throw error;
    }
    
    return res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error(`Error generating report: ${error.message}`);
    return res.json({ 
      success: false, 
      message: `Error generating report: ${error.message}` 
    });
  }
}