"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const db_1 = require("../db");
exports.default = functions_1.app.http('SubmitInspection', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        let body = {};
        try {
            body = await request.json();
        }
        catch (err) {
            // If parsing fails, body stays as {}
        }
        const { userEmail = "unknown" } = body, data = __rest(body, ["userEmail"]);
        try {
            const pool = await (0, db_1.getConnection)();
            await pool.request()
                .input("UserEmail", userEmail)
                .input("Timestamp", new Date())
                .input("ReportData", JSON.stringify(data))
                .query("INSERT INTO AuditReports (UserEmail, Timestamp, ReportData) VALUES (@UserEmail, @Timestamp, @ReportData)");
            return { status: 200, body: "Inspection saved" };
        }
        catch (error) {
            return { status: 500, body: `Error storing inspection: ${error.message}` };
        }
    }
});
