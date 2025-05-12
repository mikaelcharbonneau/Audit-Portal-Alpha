"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const db_1 = require("../db");
exports.default = functions_1.app.http('GenerateReport', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const id = request.query.get('id');
        if (!id) {
            return { status: 400, body: "Report ID is required" };
        }
        try {
            const pool = await (0, db_1.getConnection)();
            const result = await pool.request()
                .input("Id", id)
                .query("SELECT UserEmail, Timestamp, ReportData FROM AuditReports WHERE Id = @Id");
            if (result.recordset.length === 0) {
                return { status: 404, body: "Report not found" };
            }
            const reportData = result.recordset[0];
            // In the future, we'll generate an Excel file here and upload to SharePoint
            // For now, we'll just return the JSON data
            return {
                status: 200,
                jsonBody: {
                    message: "Report generation successful",
                    data: reportData,
                    reportUrl: `https://example.sharepoint.com/reports/${id}.xlsx` // Mock URL for now
                }
            };
        }
        catch (error) {
            return { status: 500, body: `Error generating report: ${error.message}` };
        }
    }
});
