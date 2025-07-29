// Mock UAE drugs data for Vercel
const mockUAEDrugs = [
  {
    'Package Name': 'Paracetamol',
    'Generic Name': 'Paracetamol',
    'Dosage Form': 'Tablets',
    'Strength': '500mg',
    'Status': 'Active',
    'Included in Thiqa/ ABM - other than 1&7- Drug Formulary': 'Yes',
    'Included In Basic Drug Formulary': 'Yes',
    'Package Price to Public': '10',
    'Manufacturer Name': 'UAE Pharma'
  },
  {
    'Package Name': 'Insulin Glargine',
    'Generic Name': 'Insulin Glargine',
    'Dosage Form': 'Injection',
    'Strength': '100 units/ml',
    'Status': 'Active',
    'Included in Thiqa/ ABM - other than 1&7- Drug Formulary': 'Yes',
    'Included In Basic Drug Formulary': 'No',
    'Package Price to Public': '150',
    'Manufacturer Name': 'Sanofi'
  }
];

export default function handler(req, res) {
  const { url, method } = req;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (url.startsWith('/api/drug-service/search')) {
    const urlParams = new URL(url, `http://${req.headers.host}`);
    const query = urlParams.searchParams.get('query') || '';
    const limit = parseInt(urlParams.searchParams.get('limit')) || 20;
    
    const results = mockUAEDrugs
      .filter(drug => 
        drug['Package Name'].toLowerCase().includes(query.toLowerCase()) ||
        drug['Generic Name'].toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit)
      .map((drug, index) => ({
        id: index + 1,
        drug_name: drug['Package Name'],
        generic_name: drug['Generic Name'],
        category: drug['Dosage Form'],
        strength: drug['Strength'],
        dosage_form: drug['Dosage Form'],
        indications: `${drug['Package Name']} is available in the UAE market.`,
        contraindications: 'Please consult healthcare provider.',
        side_effects: 'Please consult healthcare provider.',
        manufacturer: drug['Manufacturer Name'],
        price_public: drug['Package Price to Public'],
        thiqa_coverage: drug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes',
        basic_coverage: drug['Included In Basic Drug Formulary'] === 'Yes'
      }));
    
    return res.json({ results, total: results.length, query });
  }
  
  if (url.match(/\/api\/drug-service\/drugs\/\d+/)) {
    const id = parseInt(url.split('/').pop());
    const drug = mockUAEDrugs[id - 1];
    
    if (!drug) {
      return res.status(404).json({ error: 'Drug not found' });
    }
    
    return res.json({
      id,
      drug_name: drug['Package Name'],
      generic_name: drug['Generic Name'],
      category: drug['Dosage Form'],
      strength: drug['Strength'],
      dosage_form: drug['Dosage Form'],
      indications: `${drug['Package Name']} is available in the UAE market.`,
      contraindications: 'Please consult healthcare provider.',
      side_effects: 'Please consult healthcare provider.',
      manufacturer: drug['Manufacturer Name'],
      price_public: drug['Package Price to Public'],
      thiqa_coverage: drug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes',
      basic_coverage: drug['Included In Basic Drug Formulary'] === 'Yes',
      icd10_codes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  if (url.startsWith('/api/drug-service/categories')) {
    const categories = [...new Set(mockUAEDrugs.map(drug => drug['Dosage Form']))];
    return res.json({ categories });
  }
  
  if (url.startsWith('/api/daman-service/coverage')) {
    const urlParams = new URL(url, `http://${req.headers.host}`);
    const drugName = urlParams.searchParams.get('drug');
    
    const drug = mockUAEDrugs.find(d => 
      d['Package Name'].toLowerCase().includes(drugName.toLowerCase())
    );
    
    if (drug) {
      return res.json({
        name: drug['Package Name'],
        activeIngredient: drug['Generic Name'],
        dosageForm: drug['Dosage Form'],
        strength: drug['Strength'],
        thiqa: drug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes',
        basic: drug['Included In Basic Drug Formulary'] === 'Yes',
        enhanced: false,
        priorAuthorization: false,
        price_public: drug['Package Price to Public'],
        manufacturer: drug['Manufacturer Name']
      });
    }
    
    return res.status(404).json({ error: 'Medication not found' });
  }
  
  return res.status(404).json({ error: 'Not found' });
}