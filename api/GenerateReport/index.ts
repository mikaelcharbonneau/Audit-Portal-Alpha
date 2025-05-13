import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ 
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
        return res.status(404).json({ 
          success: false, 
          message: "Report not found" 
        });
      }
      throw error;
    }
    
    return res.status(200).json({
      success: true,
      data: data
    });
  } catch (error: any) {
    console.error(`Error generating report: ${error.message}`);
    return res.status(500).json({ 
      success: false, 
      message: `Error generating report: ${error.message}` 
    });
  }
}