import { Request, Response } from 'express';
import { supabase } from "../db";

export const getInspections = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('AuditReports')
      .select('*')
      .order('Timestamp', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    
    res.status(200).json(data);
  } catch (error: any) {
    console.error(`Error fetching inspections: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: `Error fetching inspections: ${error.message}` 
    });
  }
}