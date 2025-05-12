import type { Context, HttpRequest } from "@azure/functions";
import { getConnection } from "../db";

export default async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(
      "SELECT TOP 50 Id, UserEmail, Timestamp, ReportData FROM AuditReports ORDER BY Timestamp DESC"
    );
    context.res = {
      status: 200,
      body: result.recordset,
    };
  } catch (error: any) {
    context.res = {
      status: 500,
      body: `Error fetching inspections: ${error.message}`,
    };
  }
}
