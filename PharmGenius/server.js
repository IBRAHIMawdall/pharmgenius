import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import { CosmosClient } from '@azure/cosmos';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Cosmos DB with error handling
let cosmosClient, database, container;
try {
  cosmosClient = new CosmosClient({
    endpoint: process.env.COSMOS_DB_ENDPOINT,
    key: process.env.COSMOS_DB_KEY
  });
  database = cosmosClient.database(process.env.COSMOS_DB_DATABASE);
  container = database.container(process.env.COSMOS_DB_CONTAINER);
  console.log('Cosmos DB initialized successfully');
} catch (error) {
  console.error('Failed to initialize Cosmos DB:', error);
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Load UAE drug database with better error handling
const drugDbPath = path.join(__dirname, 'UAE drug list.csv');
console.log('Looking for database at:', drugDbPath);
let uaeDrugs = [];
const uaeDrugsById = new Map(); // For fast O(1) lookups by ID

try {
  if (fs.existsSync(drugDbPath)) {
    let csvData = fs.readFileSync(drugDbPath, 'utf8');
    // Remove BOM if present
    if (csvData.charCodeAt(0) === 0xFEFF) {
      csvData = csvData.slice(1);
    }

    const parsed = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      console.error('Error parsing CSV:', parsed.errors);
    }

    let idCounter = 1;
    uaeDrugs = parsed.data.filter(drug => drug['Package Name']).map(drug => {
      const drugWithId = { ...drug, id: idCounter++ };
      uaeDrugsById.set(drugWithId.id.toString(), drugWithId);
      return drugWithId;
    });

    if (uaeDrugs.length > 0) {
      console.log(`Loaded ${uaeDrugs.length} drugs from UAE database`);
    }
  } else {
    console.warn('UAE drug database file not found, using empty dataset');
  }
} catch (error) {
  console.error('Error loading UAE drug database:', error);
  // Continue with empty dataset
}

// Load Daman formulary data with better error handling
const formularyPath = path.join(__dirname, 'public', 'daman-formulary.json');
let damanFormulary = { medications: [] };

try {
  if (fs.existsSync(formularyPath)) {
    const formularyData = fs.readFileSync(formularyPath, 'utf8');
    damanFormulary = JSON.parse(formularyData);
    console.log('Daman formulary data loaded successfully');
  } else {
    console.warn('Daman formulary file not found, using empty dataset');
  }
} catch (error) {
  console.error('Error loading Daman formulary data:', error);
  // Continue with empty dataset
}

// Load ICD-10 codes with better error handling
const icd10Path = path.join(__dirname, 'public', 'icd10-data.json');
let icd10Codes = [];

try {
  if (fs.existsSync(icd10Path)) {
    const icd10Data = fs.readFileSync(icd10Path, 'utf8');
    const icd10DataObj = JSON.parse(icd10Data);
    // Convert the object structure to an array of codes
    icd10Codes = Object.values(icd10DataObj).flat();
    console.log(`Loaded ${icd10Codes.length} ICD-10 codes`);
  } else {
    console.warn('ICD-10 data file not found, using empty dataset');
  }
} catch (error) {
  console.error('Error loading ICD-10 codes:', error);
  // Continue with empty dataset
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    dataLoaded: {
      uaeDrugs: uaeDrugs.length,
      icd10Codes: icd10Codes.length,
      damanFormulary: damanFormulary.medications.length,
      cosmosDb: !!cosmosClient
    }
  });
});

// Daman coverage service
app.get('/api/daman-service/coverage', (req, res) => {
  const drugName = req.query.drug;
  
  if (!drugName) {
    return res.status(400).json({ error: 'Drug name is required' });
  }
  
  // Search in UAE database first
  const uaeDrug = uaeDrugs.find(drug => 
    (drug['Package Name'] && drug['Package Name'].toLowerCase().includes(drugName.toLowerCase())) ||
    (drug['Generic Name'] && drug['Generic Name'].toLowerCase().includes(drugName.toLowerCase()))
  );
  
  if (uaeDrug) {
    return res.json({
      name: uaeDrug['Package Name'],
      activeIngredient: uaeDrug['Generic Name'],
      dosageForm: uaeDrug['Dosage Form'],
      strength: uaeDrug['Strength'],
      thiqa: uaeDrug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes',
      basic: uaeDrug['Included In Basic Drug Formulary'] === 'Yes',
      enhanced: uaeDrug['Included In ABM 1 Drug Formulary'] === 'Yes' || uaeDrug['Included In ABM 7 Drug Formulary'] === 'Yes',
      priorAuthorization: false,
      price_public: uaeDrug['Package Price to Public'],
      manufacturer: uaeDrug['Manufacturer Name']
    });
  }
  
  // Fallback to Daman formulary
  const medication = damanFormulary.medications.find(med => 
    med.name.toLowerCase() === drugName.toLowerCase() || 
    med.activeIngredient.toLowerCase() === drugName.toLowerCase()
  );
  
  if (!medication) {
    return res.status(404).json({ error: 'Medication not found in formulary' });
  }
  
  return res.json(medication);
});

// Drug search API
app.get('/api/drug-service/search', (req, res) => {
  const query = req.query.query || '';
  const category = req.query.category || '';
  const limit = parseInt(req.query.limit) || 20;
  
  let results = uaeDrugs.filter(drug => {
    const matchesQuery = !query || 
      (drug['Package Name'] && drug['Package Name'].toLowerCase().includes(query.toLowerCase())) ||
      (drug['Generic Name'] && drug['Generic Name'].toLowerCase().includes(query.toLowerCase()));
    
    const matchesCategory = !category || 
      (drug['Dosage Form'] && drug['Dosage Form'].toLowerCase().includes(category.toLowerCase()));
    
    return matchesQuery && matchesCategory && drug['Status'] === 'Active';
  });
  
  results = results.slice(0, limit).map(drug => ({
    id: drug.id,
    drug_name: drug['Package Name'] || 'Unknown',
    generic_name: drug['Generic Name'] || 'Unknown',
    category: drug['Dosage Form'] || 'Medication',
    strength: drug['Strength'] || '',
    dosage_form: drug['Dosage Form'] || '',
    indications: `${drug['Package Name']} is available in the UAE market.`,
    contraindications: 'Please consult healthcare provider for contraindications.',
    side_effects: 'Please consult healthcare provider for side effects.',
    manufacturer: drug['Manufacturer Name'] || '',
    agent: drug['Agent Name'] || '',
    price_public: drug['Package Price to Public'] || '',
    thiqa_coverage: drug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes',
    basic_coverage: drug['Included In Basic Drug Formulary'] === 'Yes'
  }));
  
  res.json({
    results,
    total: results.length,
    query
  });
});

// Individual drug details API
app.get('/api/drug-service/drugs/:id', (req, res) => {
  const { id } = req.params;
  const drug = uaeDrugsById.get(id);

  if (!drug) {
    return res.status(404).json({ error: 'Drug not found' });
  }

  res.json({
    id: drug.id,
    drug_name: drug['Package Name'] || 'Unknown',
    generic_name: drug['Generic Name'] || 'Unknown',
    category: drug['Dosage Form'] || 'Medication',
    strength: drug['Strength'] || '',
    dosage_form: drug['Dosage Form'] || '',
    indications: `${drug['Package Name']} (${drug['Generic Name']}) is available in the UAE pharmaceutical market. This medication is manufactured by ${drug['Manufacturer Name'] || 'Unknown manufacturer'}.`,
    contraindications: 'Please consult your healthcare provider for specific contraindications and precautions.',
    side_effects: 'Please consult your healthcare provider for potential side effects and adverse reactions.',
    manufacturer: drug['Manufacturer Name'] || '',
    agent: drug['Agent Name'] || '',
    price_public: drug['Package Price to Public'] || '',
    price_pharmacy: drug['Package Price to Pharmacy'] || '',
    unit_price_public: drug['Unit Price to Public'] || '',
    thiqa_coverage: drug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes',
    basic_coverage: drug['Included In Basic Drug Formulary'] === 'Yes',
    abm1_coverage: drug['Included In ABM 1 Drug Formulary'] === 'Yes',
    abm7_coverage: drug['Included In ABM 7 Drug Formulary'] === 'Yes',
    status: drug['Status'] || '',
    icd10_codes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
});

// Drug categories API
app.get('/api/drug-service/categories', (req, res) => {
  const categories = [...new Set(uaeDrugs
    .filter(drug => drug['Dosage Form'] && drug['Status'] === 'Active')
    .map(drug => drug['Dosage Form'])
  )].sort();
  
  res.json({
    categories
  });
});

// ICD-10 codes API
app.get('/api/icd10/search', (req, res) => {
  const query = req.query.q || '';
  const limit = parseInt(req.query.limit) || 20;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter required' });
  }
  
  const results = icd10Codes.filter(code => 
    code.code.toLowerCase().includes(query.toLowerCase()) ||
    code.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, limit);
  
  res.json({
    results,
    total: results.length,
    query
  });
});

// UAE drugs API (compatibility with existing API)
app.get('/api/uae-drugs', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  try {
    const filtered = uaeDrugs.filter(drug => 
      (drug['Package Name'] && drug['Package Name'].toLowerCase().includes(q.toLowerCase())) ||
      (drug['Generic Name'] && drug['Generic Name'].toLowerCase().includes(q.toLowerCase())) ||
      (drug['Manufacturer Name'] && drug['Manufacturer Name'].toLowerCase().includes(q.toLowerCase()))
    ).slice(0, 10).map(drug => ({
      name: drug['Package Name'] || 'Unknown',
      genericName: drug['Generic Name'] || 'Unknown',
      strength: drug['Strength'] || 'N/A',
      dosageForm: drug['Dosage Form'] || 'N/A',
      drugCode: drug['Agent Name'] || 'N/A',
      manufacturer: drug['Manufacturer Name'] || 'N/A',
      packageSize: drug['Package Size'] || 'N/A',
      dispenseMode: drug['Status'] === 'Active' ? 'Available' : 'Discontinued',
      packagePricePublic: drug['Package Price to Public'] || 'N/A',
      unitPricePublic: drug['Unit Price to Public'] || 'N/A',
      thiqa: drug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes',
      basic: drug['Included In Basic Drug Formulary'] === 'Yes',
      priorAuthorization: false,
      contraindications: 'Consult healthcare provider'
    }));
    
    res.json(filtered);
  } catch (error) {
    console.error('UAE drugs API error:', error);
    res.status(500).json({ error: 'Failed to fetch drug data' });
  }
});

// Catch-all route to serve the frontend
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ 
      error: 'Frontend not built. Please run npm run build first.',
      path: req.path 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`PharmGenius server running on port ${PORT}`);
  console.log(`Loaded ${uaeDrugs.length} drugs from UAE database`);
  console.log(`Loaded ${icd10Codes.length} ICD-10 codes`);
}); 