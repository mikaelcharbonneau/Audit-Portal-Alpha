import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getConnection } from "../db";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const { id } = req.query || {};
    
    if (!id) {
      context.res = {
        status: 400,
        body: "Report ID is required"
      };
      return;
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input("Id", id)
      .query("SELECT UserEmail, Timestamp, ReportData FROM AuditReports WHERE Id = @Id");

    if (result.recordset.length === 0) {
      context.res = {
        status: 404,
        body: "Report not found"
      };
      return;
    }

    const reportData = result.recordset[0];
    
    // In the future, we'll generate an Excel file here and upload to SharePoint
    // For now, we'll just return the JSON data
    context.res = {
      status: 200,
      body: {
        message: "Report generation successful",
        data: reportData,
        reportUrl: `https://example.sharepoint.com/reports/${id}.xlsx` // Mock URL for now
      }
    };
  } catch (error: any) {
    context.res = {
      status: 500,
      body: `Error generating report: ${error.message}`
    };
  }
};

export default httpTrigger;
