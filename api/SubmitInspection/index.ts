import { app } from '@azure/functions';
import { supabase } from "../db";

export default app.http('SubmitInspection', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    let body: any = {};
    try {
      body = await request.json();
    } catch (err) {
      // If parsing fails, body stays as {}
    }
    
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
      
      return { 
        status: 200, 
        jsonBody: { 
          success: true, 
          message: "Inspection saved",
          data: data?.[0]
        } 
      };
    } catch (error: any) {
      console.error(`Error storing inspection: ${error.message}`);
      return { 
        status: 500, 
        jsonBody: { 
          success: false, 
          message: `Error storing inspection: ${error.message}` 
        } 
      };
    }
  }
});