import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Simple CSV parser function
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const fields = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    
    fields.push(current.trim().replace(/^"|"$/g, ''));
    result.push(fields);
  }
  
  return result;
}

// Load UAE drug database
const drugDbPath = path.join(__dirname, '..', 'database', 'database', 'UAE drug list.csv');
console.log('Looking for database at:', drugDbPath);
let uaeDrugs = [];

try {
  let csvData = fs.readFileSync(drugDbPath, 'utf8');
  // Remove BOM if present
  if (csvData.charCodeAt(0) === 0xFEFF) {
    csvData = csvData.slice(1);
  }
  const rows = parseCSV(csvData);
  
  if (rows.length > 0) {
    const headers = rows[0];
    
    for (let i = 1; i < rows.length; i++) {
      const drug = {};
      for (let j = 0; j < headers.length; j++) {
        drug[headers[j]] = rows[i][j] || '';
      }
      if (drug['Package Name']) {
        uaeDrugs.push(drug);
      }
    }
  }
  
  console.log(`Loaded ${uaeDrugs.length} drugs from UAE database`);
} catch (error) {
  console.error('Error loading UAE drug database:', error);
}

// Load Daman formulary data
const formularyPath = path.join(__dirname, 'database', 'daman_formulary.json');
let damanFormulary = { medications: [] };

try {
  const formularyData = fs.readFileSync(formularyPath, 'utf8');
  damanFormulary = JSON.parse(formularyData);
} catch (error) {
  console.error('Error loading Daman formulary data:', error);
}

// API Routes
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
  
  results = results.slice(0, limit).map((drug, index) => ({
    id: index + 1,
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

app.get('/api/drug-service/drugs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  // Find drug by searching through the filtered results
  const query = req.query.query || '';
  let filteredDrugs = uaeDrugs.filter(drug => {
    const matchesQuery = !query || 
      (drug['Package Name'] && drug['Package Name'].toLowerCase().includes(query.toLowerCase())) ||
      (drug['Generic Name'] && drug['Generic Name'].toLowerCase().includes(query.toLowerCase()));
    return matchesQuery && drug['Status'] === 'Active';
  });
  
  if (id <= 0 || id > filteredDrugs.length) {
    return res.status(404).json({ error: 'Drug not found' });
  }
  
  const drug = filteredDrugs[id - 1];
  
  res.json({
    id,
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

app.get('/api/drug-service/categories', (req, res) => {
  const categories = [...new Set(uaeDrugs
    .filter(drug => drug['Dosage Form'] && drug['Status'] === 'Active')
    .map(drug => drug['Dosage Form'])
  )].sort();
  
  res.json({
    categories
  });
});

// Catch-all route to serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});