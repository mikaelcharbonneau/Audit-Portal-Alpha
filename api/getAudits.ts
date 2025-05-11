import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getConnection } from "./db";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT Id, UserEmail, Timestamp, ReportData FROM AuditReports ORDER BY Timestamp DESC");
        context.res = {
            status: 200,
            body: result.recordset
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: `Error fetching audits: ${error.message}`
        };
    }
};

export default httpTrigger;
