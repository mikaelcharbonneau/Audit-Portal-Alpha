import { Request, Response } from 'express';
import { supabase } from "../db";

export const getInspections = async (req: Request, res: Response) => {
  // Set JSON content type header
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const { data, error } = await supabase
      .from('AuditReports')
      .select('*')
      .order('Timestamp', { ascending: false })
      .limit(50);
    
    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    return res.status(200).json(data || []);
  } catch (error: any) {
    console.error('Error fetching inspections:', error);
    return res.status(500).json({ 
      success: false, 
      message: error?.message || 'An unexpected error occurred while fetching inspections'
    });
  }
};