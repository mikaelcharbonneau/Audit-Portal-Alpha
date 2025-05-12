import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { getConnection } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// GenerateReport endpoint (GET)
app.get('/api/GenerateReport', function (req, res) {
  (async () => {
    const id = req.query.id;
    if (!id) {
      return res.status(400).send('Report ID is required');
    }
    try {
      const pool = await getConnection();
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
    } catch (error: any) {
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
      const pool = await getConnection();
      const result = await pool.request().query(
        'SELECT TOP 50 Id, UserEmail, Timestamp, ReportData FROM AuditReports ORDER BY Timestamp DESC'
      );
      res.status(200).json(result.recordset);
    } catch (error: any) {
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
    const { userEmail = 'unknown', ...data } = body;
    try {
      const pool = await getConnection();
      await pool.request()
        .input('UserEmail', userEmail)
        .input('Timestamp', new Date())
        .input('ReportData', JSON.stringify(data))
        .query('INSERT INTO AuditReports (UserEmail, Timestamp, ReportData) VALUES (@UserEmail, @Timestamp, @ReportData)');
      res.status(200).send('Inspection saved');
    } catch (error: any) {
      res.status(500).send(`Error storing inspection: ${error.message}`);
    }
  })().catch(error => {
    res.status(500).send(`Error storing inspection: ${error.message}`);
  });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
