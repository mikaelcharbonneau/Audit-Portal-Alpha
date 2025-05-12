import { app } from '@azure/functions';
import { getConnection } from "../db";

export default app.http('GetInspections', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(
        "SELECT TOP 50 Id, UserEmail, Timestamp, ReportData FROM AuditReports ORDER BY Timestamp DESC"
      );
      return { status: 200, jsonBody: result.recordset };
    } catch (error: any) {
      return { status: 500, body: `Error fetching inspections: ${error.message}` };
    }
  }
});
