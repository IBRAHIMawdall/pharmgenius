import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Load UAE drug database
const drugDbPath = path.join(__dirname, 'UAE drug list.csv');
console.log('Looking for database at:', drugDbPath);
let uaeDrugs = [];
const uaeDrugsById = new Map();

try {
  if (fs.existsSync(drugDbPath)) {
    let csvData = fs.readFileSync(drugDbPath, 'utf8');
    if (csvData.charCodeAt(0) === 0xFEFF) {
      csvData = csvData.slice(1);
    }

    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    let idCounter = 1;
    uaeDrugs = parsed.data.filter(drug => drug['Package Name']).map(drug => {
      const drugWithId = { ...drug, id: idCounter++ };
      uaeDrugsById.set(drugWithId.id.toString(), drugWithId);
      return drugWithId;
    });

    console.log(`Loaded ${uaeDrugs.length} drugs from UAE database`);
  } else {
    console.log('UAE drug database not found, using sample data');
    // Sample data for testing
    uaeDrugs = [
      {
        id: 1,
        'Package Name': 'Paracetamol 500mg',
        'Generic Name': 'Paracetamol',
        'Dosage Form': 'Tablet',
        'Strength': '500mg',
        'Manufacturer Name': 'Sample Manufacturer',
        'Status': 'Active'
      }
    ];
  }
} catch (error) {
  console.error('Error loading UAE drug database:', error);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PharmGenius server is running',
    drugsLoaded: uaeDrugs.length,
    timestamp: new Date().toISOString()
  });
});

// Drug categories API
app.get('/api/drug-service/categories', (req, res) => {
  const categories = [...new Set(uaeDrugs
    .filter(drug => drug['Dosage Form'] && drug['Status'] === 'Active')
    .map(drug => drug['Dosage Form'])
  )].sort();
  
  res.json({ categories });
});

// Drug search API
app.get('/api/drug-service/search', (req, res) => {
  const query = req.query.query || '';
  const limit = parseInt(req.query.limit) || 20;
  
  let results = uaeDrugs.filter(drug => {
    return !query || 
      (drug['Package Name'] && drug['Package Name'].toLowerCase().includes(query.toLowerCase())) ||
      (drug['Generic Name'] && drug['Generic Name'].toLowerCase().includes(query.toLowerCase()));
  });
  
  results = results.slice(0, limit).map(drug => ({
    id: drug.id,
    drug_name: drug['Package Name'] || 'Unknown',
    generic_name: drug['Generic Name'] || 'Unknown',
    category: drug['Dosage Form'] || 'Medication',
    strength: drug['Strength'] || '',
    manufacturer: drug['Manufacturer Name'] || ''
  }));
  
  res.json({ results, total: results.length, query });
});

// Catch-all route to serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`PharmGenius server running on port ${PORT}`);
  console.log(`Loaded ${uaeDrugs.length} drugs`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
}); 