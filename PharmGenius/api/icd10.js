// Sample ICD-10 data for demonstration
const icd10Data = {
  "A00-B99": "Certain infectious and parasitic diseases",
  "C00-D49": "Neoplasms",
  "D50-D89": "Diseases of the blood and blood-forming organs and certain disorders involving the immune mechanism",
  "E00-E89": "Endocrine, nutritional and metabolic diseases",
  "F01-F99": "Mental, Behavioral and Neurodevelopmental disorders",
  "G00-G99": "Diseases of the nervous system",
  "H00-H59": "Diseases of the eye and adnexa",
  "H60-H95": "Diseases of the ear and mastoid process",
  "I00-I99": "Diseases of the circulatory system",
  "J00-J99": "Diseases of the respiratory system",
  "K00-K95": "Diseases of the digestive system",
  "L00-L99": "Diseases of the skin and subcutaneous tissue",
  "M00-M99": "Diseases of the musculoskeletal system and connective tissue",
  "N00-N99": "Diseases of the genitourinary system",
  "O00-O9A": "Pregnancy, childbirth and the puerperium",
  "P00-P96": "Certain conditions originating in the perinatal period",
  "Q00-Q99": "Congenital malformations, deformations and chromosomal abnormalities",
  "R00-R99": "Symptoms, signs and abnormal clinical and laboratory findings, not elsewhere classified",
  "S00-T88": "Injury, poisoning and certain other consequences of external causes",
  "V00-Y99": "External causes of morbidity",
  "Z00-Z99": "Factors influencing health status and contact with health services"
};

// Drug to ICD-10 mapping for common medications
const drugToIcd10Map = {
  "metformin": [{code: "E11.9", description: "Type 2 diabetes mellitus without complications"}, {code: "E11.65", description: "Type 2 diabetes mellitus with hyperglycemia"}],
  "lisinopril": [{code: "I10", description: "Essential (primary) hypertension"}, {code: "I11.9", description: "Hypertensive heart disease without heart failure"}],
  "aspirin": [{code: "I25.10", description: "Atherosclerotic heart disease of native coronary artery"}, {code: "Z79.82", description: "Long term (current) use of aspirin"}],
  "atorvastatin": [{code: "E78.5", description: "Hyperlipidemia, unspecified"}, {code: "E78.2", description: "Mixed hyperlipidemia"}],
  "levothyroxine": [{code: "E03.9", description: "Hypothyroidism, unspecified"}, {code: "E89.0", description: "Postprocedural hypothyroidism"}],
  "amlodipine": [{code: "I10", description: "Essential (primary) hypertension"}],
  "omeprazole": [{code: "K21.9", description: "Gastro-esophageal reflux disease without esophagitis"}, {code: "K29.60", description: "Other gastritis without bleeding"}],
  "albuterol": [{code: "J45.909", description: "Unspecified asthma, uncomplicated"}, {code: "J44.9", description: "Chronic obstructive pulmonary disease, unspecified"}],
  "insulin": [{code: "E11.9", description: "Type 2 diabetes mellitus without complications"}, {code: "E10.9", description: "Type 1 diabetes mellitus without complications"}],
  "ozempic": [{code: "E11.9", description: "Type 2 diabetes mellitus without complications"}, {code: "E66.9", description: "Obesity, unspecified"}],
  "simvastatin": [{code: "E78.5", description: "Hyperlipidemia, unspecified"}, {code: "E78.2", description: "Mixed hyperlipidemia"}],
  "prednisone": [{code: "M79.3", description: "Panniculitis, unspecified"}, {code: "J45.9", description: "Asthma, unspecified"}],
  "furosemide": [{code: "I50.9", description: "Heart failure, unspecified"}, {code: "N18.6", description: "End stage renal disease"}],
  "tramadol": [{code: "M79.3", description: "Panniculitis, unspecified"}, {code: "G89.29", description: "Other chronic pain"}],
  "sertraline": [{code: "F32.9", description: "Major depressive disorder, single episode, unspecified"}, {code: "F41.9", description: "Anxiety disorder, unspecified"}],
  "pantoprazole": [{code: "K21.9", description: "Gastro-esophageal reflux disease without esophagitis"}, {code: "K29.60", description: "Other gastritis without bleeding"}],
  "montelukast": [{code: "J45.909", description: "Unspecified asthma, uncomplicated"}],
  "fluticasone": [{code: "J45.909", description: "Unspecified asthma, uncomplicated"}, {code: "J30.9", description: "Allergic rhinitis, unspecified"}],
  "carvedilol": [{code: "I50.9", description: "Heart failure, unspecified"}, {code: "I10", description: "Essential (primary) hypertension"}],
  "spironolactone": [{code: "I50.9", description: "Heart failure, unspecified"}, {code: "I10", description: "Essential (primary) hypertension"}],
  "digoxin": [{code: "I48.91", description: "Unspecified atrial fibrillation"}, {code: "I50.9", description: "Heart failure, unspecified"}],
  "diltiazem": [{code: "I10", description: "Essential (primary) hypertension"}, {code: "I20.9", description: "Angina pectoris, unspecified"}],
  "valsartan": [{code: "I10", description: "Essential (primary) hypertension"}, {code: "I50.9", description: "Heart failure, unspecified"}],
  "rosuvastatin": [{code: "E78.5", description: "Hyperlipidemia, unspecified"}, {code: "E78.2", description: "Mixed hyperlipidemia"}],
  "escitalopram": [{code: "F32.9", description: "Major depressive disorder, single episode, unspecified"}, {code: "F41.9", description: "Anxiety disorder, unspecified"}],
  "duloxetine": [{code: "F32.9", description: "Major depressive disorder, single episode, unspecified"}, {code: "G89.29", description: "Other chronic pain"}],
  "pregabalin": [{code: "G89.29", description: "Other chronic pain"}, {code: "G40.909", description: "Epilepsy, unspecified, not intractable, without status epilepticus"}],
  "telmisartan": [{code: "I10", description: "Essential (primary) hypertension"}],
  "bisoprolol": [{code: "I10", description: "Essential (primary) hypertension"}, {code: "I50.9", description: "Heart failure, unspecified"}],
  "indapamide": [{code: "I10", description: "Essential (primary) hypertension"}],
  "ramipril": [{code: "I10", description: "Essential (primary) hypertension"}, {code: "I50.9", description: "Heart failure, unspecified"}],
  "candesartan": [{code: "I10", description: "Essential (primary) hypertension"}, {code: "I50.9", description: "Heart failure, unspecified"}],
  "perindopril": [{code: "I10", description: "Essential (primary) hypertension"}, {code: "I25.10", description: "Atherosclerotic heart disease of native coronary artery"}],
  "nebivolol": [{code: "I10", description: "Essential (primary) hypertension"}],
  "ezetimibe": [{code: "E78.5", description: "Hyperlipidemia, unspecified"}],
  "fenofibrate": [{code: "E78.5", description: "Hyperlipidemia, unspecified"}, {code: "E78.2", description: "Mixed hyperlipidemia"}],
  "glimepiride": [{code: "E11.9", description: "Type 2 diabetes mellitus without complications"}],
  "gliclazide": [{code: "E11.9", description: "Type 2 diabetes mellitus without complications"}],
  "pioglitazone": [{code: "E11.9", description: "Type 2 diabetes mellitus without complications"}],
  "sitagliptin": [{code: "E11.9", description: "Type 2 diabetes mellitus without complications"}],
  "vildagliptin": [{code: "E11.9", description: "Type 2 diabetes mellitus without complications"}],
  "empagliflozin": [{code: "E11.9", description: "Type 2 diabetes mellitus without complications"}, {code: "I50.9", description: "Heart failure, unspecified"}],
  "dapagliflozin": [{code: "E11.9", description: "Type 2 diabetes mellitus without complications"}, {code: "I50.9", description: "Heart failure, unspecified"}],
  "liraglutide": [{code: "E11.9", description: "Type 2 diabetes mellitus without complications"}, {code: "E66.9", description: "Obesity, unspecified"}],
  "warfarin": [{code: "I48.91", description: "Unspecified atrial fibrillation"}, {code: "Z79.01", description: "Long term (current) use of anticoagulants"}],
  "clopidogrel": [{code: "I25.10", description: "Atherosclerotic heart disease of native coronary artery"}, {code: "Z79.82", description: "Long term (current) use of aspirin"}],
  "losartan": [{code: "I10", description: "Essential (primary) hypertension"}, {code: "N18.6", description: "End stage renal disease"}],
  "hydrochlorothiazide": [{code: "I10", description: "Essential (primary) hypertension"}],
  "gabapentin": [{code: "G89.29", description: "Other chronic pain"}, {code: "G40.909", description: "Epilepsy, unspecified, not intractable, without status epilepticus"}]
};

export default function handler(req, res) {
  const { drug } = req.query;
  
  if (!drug) {
    return res.status(400).json({ error: 'Drug name is required' });
  }
  
  // Search for the drug in our mapping
  const drugLower = drug.toLowerCase();
  let results = [];
  
  // Check for exact matches first
  if (drugToIcd10Map[drugLower]) {
    results = drugToIcd10Map[drugLower];
  } else {
    // Check for partial matches
    for (const [key, codes] of Object.entries(drugToIcd10Map)) {
      if (key.includes(drugLower) || drugLower.includes(key)) {
        results = [...results, ...codes];
      }
    }
  }
  
  // Remove duplicates
  const uniqueResults = results.filter((item, index, self) =>
    index === self.findIndex((t) => t.code === item.code)
  );
  
  return res.status(200).json({ results: uniqueResults });
}