import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getConnection } from "./db";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const auditData = req.body;
    const userEmail = auditData.userEmail || "unknown";
    const timestamp = new Date();
    const reportData = JSON.stringify(auditData.reportData || auditData);

    try {
        const pool = await getConnection();
        await pool.request()
            .input("UserEmail", userEmail)
            .input("Timestamp", timestamp)
            .input("ReportData", reportData)
            .query(`INSERT INTO AuditReports (UserEmail, Timestamp, ReportData) VALUES (@UserEmail, @Timestamp, @ReportData)`);
        context.res = {
            status: 200,
            body: "Audit received and stored."
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: `Error storing audit: ${error.message}`
        };
    }
};

export default httpTrigger;
