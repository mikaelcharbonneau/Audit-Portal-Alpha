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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
// GenerateReport endpoint (GET)
app.get('/api/GenerateReport', function (req, res) {
    (async () => {
        const id = req.query.id;
        if (!id) {
            return res.status(400).send('Report ID is required');
        }
        try {
            const pool = await (0, db_1.getConnection)();
            const result = await pool.request()
                .input('Id', id)
                .query('SELECT UserEmail, Timestamp, ReportData FROM AuditReports WHERE Id = @Id');
            if (result.recordset.length === 0) {
                return res.status(404).send('Report not found');
            }
            const reportData = result.recordset[0];
            res.status(200).json({
                message: 'Report generation successful',
                data: reportData,
                reportUrl: `https://example.sharepoint.com/reports/${id}.xlsx`
            });
        }
        catch (error) {
            res.status(500).send(`Error generating report: ${error.message}`);
        }
    })().catch(error => {
        res.status(500).send(`Error generating report: ${error.message}`);
    });
});
// GetInspections endpoint (GET)
app.get('/api/GetInspections', function (req, res) {
    (async () => {
        try {
            const pool = await (0, db_1.getConnection)();
            const result = await pool.request().query('SELECT TOP 50 Id, UserEmail, Timestamp, ReportData FROM AuditReports ORDER BY Timestamp DESC');
            res.status(200).json(result.recordset);
        }
        catch (error) {
            res.status(500).send(`Error fetching inspections: ${error.message}`);
        }
    })().catch(error => {
        res.status(500).send(`Error fetching inspections: ${error.message}`);
    });
});
// SubmitInspection endpoint (POST)
app.post('/api/SubmitInspection', function (req, res) {
    (async () => {
        let body = req.body || {};
        const { userEmail = 'unknown' } = body, data = __rest(body, ["userEmail"]);
        try {
            const pool = await (0, db_1.getConnection)();
            await pool.request()
                .input('UserEmail', userEmail)
                .input('Timestamp', new Date())
                .input('ReportData', JSON.stringify(data))
                .query('INSERT INTO AuditReports (UserEmail, Timestamp, ReportData) VALUES (@UserEmail, @Timestamp, @ReportData)');
            res.status(200).send('Inspection saved');
        }
        catch (error) {
            res.status(500).send(`Error storing inspection: ${error.message}`);
        }
    })().catch(error => {
        res.status(500).send(`Error storing inspection: ${error.message}`);
    });
});
// Serve static files from the frontend build (dist at project root)
const path_1 = __importDefault(require("path"));
app.use(express_1.default.static(path_1.default.join(__dirname, '../../dist')));
// SPA fallback: serve index.html for any non-API route
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../dist', 'index.html'));
});
// Health check endpoint (keep for /api/ or debugging)
app.get('/api', (req, res) => {
    res.send('API is running');
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
