import { app } from '@azure/functions';
import { supabase } from "../db";

export default app.http('GenerateReport', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const id = request.query.get('id');

    if (!id) {
      return { 
        status: 400, 
        jsonBody: { 
          success: false, 
          message: "Report ID is required" 
        } 
      };
    }

    try {
      const { data, error } = await supabase
        .from('AuditReports')
        .select('*')
        .eq('Id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return { 
            status: 404, 
            jsonBody: { 
              success: false, 
              message: "Report not found" 
            } 
          };
        }
        throw error;
      }
      
      return {
        status: 200,
        jsonBody: {
          success: true,
          data: data
        }
      };
    } catch (error: any) {
      console.error(`Error generating report: ${error.message}`);
      return { 
        status: 500, 
        jsonBody: { 
          success: false, 
          message: `Error generating report: ${error.message}` 
        } 
      };
    }
  }
});