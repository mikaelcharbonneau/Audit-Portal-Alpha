import { Request, Response } from 'express';
import { supabase } from "../db";

export default async function handler(req: Request, res: Response) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { userEmail = "unknown", ...reportData } = req.body;
    
    if (!reportData.datahall) {
      return res.status(400).json({
        success: false,
        message: "Data hall is required"
      });
    }

    const { data, error } = await supabase
      .from('AuditReports')
      .insert([
        { 
          UserEmail: userEmail,
          ReportData: reportData,
          Timestamp: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: "Inspection saved",
      data: data?.[0]
    });
  } catch (error: any) {
    console.error('Error storing inspection:', error);
    return res.status(500).json({ 
      success: false, 
      message: error?.message || 'An unexpected error occurred while storing the inspection'
    });
  }
}