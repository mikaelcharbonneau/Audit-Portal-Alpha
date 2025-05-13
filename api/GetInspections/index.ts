import { app } from '@azure/functions';
import { supabase } from "../db";

export default app.http('GetInspections', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const { data, error } = await supabase
        .from('AuditReports')
        .select('*')
        .order('Timestamp', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      return { 
        status: 200, 
        jsonBody: data
      };
    } catch (error: any) {
      console.error(`Error fetching inspections: ${error.message}`);
      return { 
        status: 500, 
        jsonBody: { 
          success: false, 
          message: `Error fetching inspections: ${error.message}` 
        } 
      };
    }
  }
});