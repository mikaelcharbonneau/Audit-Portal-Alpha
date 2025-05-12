import type { Context, HttpRequest } from "@azure/functions";
import { getConnection } from "../db";

export default async function (context: Context, req: HttpRequest): Promise<void> {
  const { userEmail = "unknown", ...data } = req.body || {};
  try {
    const pool = await getConnection();
    await pool.request()
      .input("UserEmail", userEmail)
      .input("Timestamp", new Date())
      .input("ReportData", JSON.stringify(data))
      .query("INSERT INTO AuditReports (UserEmail, Timestamp, ReportData) VALUES (@UserEmail, @Timestamp, @ReportData)");

    context.res = { status: 200, body: "Inspection saved" };
  } catch (error: any) {
    context.res = { status: 500, body: `Error storing inspection: ${error.message}` };
  }
}
