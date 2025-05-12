import { app } from '@azure/functions';
import { getConnection } from "../db";

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
    const { userEmail = "unknown", ...data } = body;
    try {
      const pool = await getConnection();
      await pool.request()
        .input("UserEmail", userEmail)
        .input("Timestamp", new Date())
        .input("ReportData", JSON.stringify(data))
        .query("INSERT INTO AuditReports (UserEmail, Timestamp, ReportData) VALUES (@UserEmail, @Timestamp, @ReportData)");
      return { status: 200, body: "Inspection saved" };
    } catch (error: any) {
      return { status: 500, body: `Error storing inspection: ${error.message}` };
    }
  }
});
