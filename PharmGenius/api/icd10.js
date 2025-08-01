// ICD-10 API servers in priority order
const ICD10_APIS = [
  {
    name: 'NIH Clinical Tables',
    url: (terms) => `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${encodeURIComponent(terms)}`,
    parser: (data) => {
      const [count, codes, , descriptions] = data;
      if (!descriptions || descriptions.length === 0) return [];
      return descriptions.map(([code, description]) => ({ code, description }));
    }
  },
  {
    name: 'ICD-10 API.com',
    url: (terms) => `https://icd10api.com/?s=${encodeURIComponent(terms)}&desc=short&r=json`,
    parser: (data) => {
      if (!data || !Array.isArray(data)) return [];
      return data.map(item => ({
        code: item.code || item.icd10_code,
        description: item.desc || item.description || item.name
      })).filter(item => item.code && item.description);
    }
  },
  {
    name: 'WHO ICD API',
    url: (terms) => `https://id.who.int/icd/release/11/2019-04/mms/search?q=${encodeURIComponent(terms)}`,
    parser: (data) => {
      if (!data || !data.destinationEntities) return [];
      return data.destinationEntities.map(entity => ({
        code: entity.theCode,
        description: entity.title
      })).filter(item => item.code && item.description);
    }
  }
];

// Fallback drug-to-ICD mapping for common medications
const DRUG_ICD_FALLBACK = {
  'metformin': [{ code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }],
  'insulin': [{ code: 'E10.9', description: 'Type 1 diabetes mellitus without complications' }],
  'lisinopril': [{ code: 'I10', description: 'Essential (primary) hypertension' }],
  'atorvastatin': [{ code: 'E78.5', description: 'Hyperlipidemia, unspecified' }],
  'amlodipine': [{ code: 'I10', description: 'Essential (primary) hypertension' }],
  'omeprazole': [{ code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' }],
  'aspirin': [{ code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery' }],
  'albuterol': [{ code: 'J45.909', description: 'Unspecified asthma, uncomplicated' }],
  'levothyroxine': [{ code: 'E03.9', description: 'Hypothyroidism, unspecified' }],
  'warfarin': [{ code: 'I48.91', description: 'Unspecified atrial fibrillation' }]
};

async function tryAPI(api, terms) {
  try {
    const response = await fetch(api.url(terms), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PharmGenius/1.0'
      },
      timeout: 5000
    });
    
    if (!response.ok) {
      throw new Error(`${api.name} returned ${response.status}`);
    }
    
    const data = await response.json();
    const results = api.parser(data);
    
    if (results && results.length > 0) {
      console.log(`✅ ${api.name} returned ${results.length} results`);
      return results;
    }
    
    return null;
  } catch (error) {
    console.log(`❌ ${api.name} failed:`, error.message);
    return null;
  }
}

export default async function handler(req, res) {
  const { terms } = req.query;
  
  if (!terms) {
    return res.status(400).json({ error: 'Search terms required' });
  }
  
  console.log(`🔍 Searching ICD-10 codes for: ${terms}`);
  
  // Try each API in sequence
  for (const api of ICD10_APIS) {
    console.log(`🌐 Trying ${api.name}...`);
    const results = await tryAPI(api, terms);
    
    if (results && results.length > 0) {
      return res.status(200).json({ 
        results: results.slice(0, 10), // Limit to 10 results
        source: api.name
      });
    }
  }
  
  // Fallback to local drug mapping
  console.log('🔄 Trying fallback drug mapping...');
  const drugLower = terms.toLowerCase();
  
  for (const [drug, codes] of Object.entries(DRUG_ICD_FALLBACK)) {
    if (drugLower.includes(drug) || drug.includes(drugLower)) {
      console.log(`✅ Found fallback mapping for ${drug}`);
      return res.status(200).json({ 
        results: codes,
        source: 'Local Fallback'
      });
    }
  }
  
  console.log('❌ No ICD-10 codes found');
  return res.status(200).json({ 
    results: [],
    source: 'None'
  });
}