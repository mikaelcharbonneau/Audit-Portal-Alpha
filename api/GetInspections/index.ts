import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from "../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { data, error } = await supabase
      .from('AuditReports')
      .select('*')
      .order('Timestamp', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    
    return res.status(200).json(data);
  } catch (error: any) {
    console.error(`Error fetching inspections: ${error.message}`);
    return res.status(500).json({ 
      success: false, 
      message: `Error fetching inspections: ${error.message}` 
    });
  }
}