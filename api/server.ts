import express from 'express';
import cors from 'cors';
import { getInspections } from './GetInspections';

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Mount the GetInspections endpoint
app.get('/api/inspections', getInspections);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});