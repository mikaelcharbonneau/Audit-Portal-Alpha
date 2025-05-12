"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const db_1 = require("../db");
exports.default = functions_1.app.http('GetInspections', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const pool = await (0, db_1.getConnection)();
            const result = await pool.request().query("SELECT TOP 50 Id, UserEmail, Timestamp, ReportData FROM AuditReports ORDER BY Timestamp DESC");
            return { status: 200, jsonBody: result.recordset };
        }
        catch (error) {
            return { status: 500, body: `Error fetching inspections: ${error.message}` };
        }
    }
});
