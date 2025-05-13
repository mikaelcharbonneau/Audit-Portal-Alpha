import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  const body = req.body;
  const { userEmail = "unknown", ...reportData } = body;
  
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
    
    return res.status(200).json({ 
      success: true, 
      message: "Inspection saved",
      data: data?.[0]
    });
  } catch (error: any) {
    console.error(`Error storing inspection: ${error.message}`);
    return res.status(500).json({ 
      success: false, 
      message: `Error storing inspection: ${error.message}` 
    });
  }
}