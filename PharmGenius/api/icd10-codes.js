// Enhanced drug-to-ICD mapping for UAE medications
const DRUG_ICD_MAPPING = {
  // Diabetes medications
  'metformin': [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'E11.65', description: 'Type 2 diabetes mellitus with hyperglycemia' }
  ],
  'insulin': [
    { code: 'E10.9', description: 'Type 1 diabetes mellitus without complications' },
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }
  ],
  'glimepiride': [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }
  ],
  'gliclazide': [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }
  ],
  'sitagliptin': [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' }
  ],
  'empagliflozin': [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'I50.9', description: 'Heart failure, unspecified' }
  ],
  'liraglutide': [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'E66.9', description: 'Obesity, unspecified' }
  ],
  'ozempic': [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'E66.9', description: 'Obesity, unspecified' }
  ],

  // Cardiovascular medications
  'lisinopril': [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'I50.9', description: 'Heart failure, unspecified' }
  ],
  'amlodipine': [
    { code: 'I10', description: 'Essential (primary) hypertension' }
  ],
  'atorvastatin': [
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
    { code: 'E78.2', description: 'Mixed hyperlipidemia' }
  ],
  'simvastatin': [
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' }
  ],
  'rosuvastatin': [
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' }
  ],
  'carvedilol': [
    { code: 'I50.9', description: 'Heart failure, unspecified' },
    { code: 'I10', description: 'Essential (primary) hypertension' }
  ],
  'bisoprolol': [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'I50.9', description: 'Heart failure, unspecified' }
  ],
  'warfarin': [
    { code: 'I48.91', description: 'Unspecified atrial fibrillation' },
    { code: 'Z79.01', description: 'Long term (current) use of anticoagulants' }
  ],
  'clopidogrel': [
    { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery' }
  ],

  // Respiratory medications
  'albuterol': [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' }
  ],
  'montelukast': [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' }
  ],
  'fluticasone': [
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'J30.9', description: 'Allergic rhinitis, unspecified' }
  ],

  // Gastrointestinal medications
  'omeprazole': [
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' },
    { code: 'K29.60', description: 'Other gastritis without bleeding' }
  ],
  'pantoprazole': [
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' }
  ],
  'esomeprazole': [
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' }
  ],

  // Endocrine medications
  'levothyroxine': [
    { code: 'E03.9', description: 'Hypothyroidism, unspecified' },
    { code: 'E89.0', description: 'Postprocedural hypothyroidism' }
  ],

  // Pain medications
  'tramadol': [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'M79.3', description: 'Panniculitis, unspecified' }
  ],
  'gabapentin': [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'G40.909', description: 'Epilepsy, unspecified, not intractable, without status epilepticus' }
  ],
  'pregabalin': [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'G40.909', description: 'Epilepsy, unspecified, not intractable, without status epilepticus' }
  ],

  // Psychiatric medications
  'sertraline': [
    { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
    { code: 'F41.9', description: 'Anxiety disorder, unspecified' }
  ],
  'escitalopram': [
    { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
    { code: 'F41.9', description: 'Anxiety disorder, unspecified' }
  ],
  'duloxetine': [
    { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
    { code: 'G89.29', description: 'Other chronic pain' }
  ],

  // Common medications
  'aspirin': [
    { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery' },
    { code: 'Z79.82', description: 'Long term (current) use of aspirin' }
  ],
  'paracetamol': [
    { code: 'R50.9', description: 'Fever, unspecified' },
    { code: 'G89.29', description: 'Other chronic pain' }
  ],
  'ibuprofen': [
    { code: 'G89.29', description: 'Other chronic pain' },
    { code: 'R50.9', description: 'Fever, unspecified' }
  ]
};

async function searchExternalAPIs(drugName) {
  const apis = [
    {
      name: 'NIH Clinical Tables',
      url: `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${encodeURIComponent(drugName)}`,
      parser: (data) => {
        const [count, codes, , descriptions] = data;
        if (!descriptions || descriptions.length === 0) return [];
        return descriptions.map(([code, description]) => ({ code, description }));
      }
    }
  ];

  for (const api of apis) {
    try {
      const response = await fetch(api.url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        timeout: 3000
      });
      
      if (response.ok) {
        const data = await response.json();
        const results = api.parser(data);
        if (results && results.length > 0) {
          return results.slice(0, 5);
        }
      }
    } catch (error) {
      console.log(`${api.name} failed:`, error.message);
    }
  }
  
  return [];
}

export default async function handler(req, res) {
  const { drug } = req.query;
  
  if (!drug) {
    return res.status(400).json({ error: 'Drug name is required' });
  }
  
  const drugLower = drug.toLowerCase();
  let results = [];
  
  // First try local mapping
  if (DRUG_ICD_MAPPING[drugLower]) {
    results = DRUG_ICD_MAPPING[drugLower];
  } else {
    // Check for partial matches in local mapping
    for (const [key, codes] of Object.entries(DRUG_ICD_MAPPING)) {
      if (key.includes(drugLower) || drugLower.includes(key)) {
        results = [...results, ...codes];
      }
    }
  }
  
  // If no local results, try external APIs
  if (results.length === 0) {
    results = await searchExternalAPIs(drug);
  }
  
  // Remove duplicates
  const uniqueResults = results.filter((item, index, self) =>
    index === self.findIndex((t) => t.code === item.code)
  );
  
  return res.status(200).json(uniqueResults.slice(0, 8));
}