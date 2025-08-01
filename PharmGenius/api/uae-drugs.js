export default async function handler(req, res) {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  try {
    // UAE Drug Registry API (using Vale Druglist or similar)
    const response = await fetch(`https://api.drugbank.com/v1/drugs/search?q=${encodeURIComponent(q)}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'UAE-PharmGenius/1.0'
      }
    });

    if (!response.ok) {
      // Use local UAE drug database
      const response = await fetch('/daman-formulary.json');
      const data = await response.json();
      const allMedications = data.medications;
      
      const filtered = allMedications.filter(drug => 
        drug.name.toLowerCase().includes(q.toLowerCase()) ||
        drug.genericName.toLowerCase().includes(q.toLowerCase()) ||
        drug.drugCode.toLowerCase().includes(q.toLowerCase()) ||
        drug.manufacturer.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 10); // Limit to 10 results
      
      return res.json(filtered);
    }

    const data = await response.json();
    
    // Transform API response to match UAE format
    const transformedData = data.map(drug => ({
      name: drug.name || drug.brand_name,
      genericName: drug.generic_name || drug.name,
      strength: drug.strength || "N/A",
      dosageForm: drug.dosage_form || "N/A",
      drugCode: drug.drug_code || "N/A",
      manufacturer: drug.manufacturer || "N/A",
      packageSize: drug.package_size || "N/A",
      dispenseMode: drug.prescription_required ? "Prescription Only Medicine" : "Over The Counter - Pharmacy",
      packagePricePublic: drug.price || "N/A",
      unitPricePublic: drug.unit_price || "N/A",
      thiqa: drug.insurance_coverage?.thiqa || false,
      basic: drug.insurance_coverage?.basic || false,
      priorAuthorization: drug.prior_authorization || false,
      contraindications: drug.contraindications || "Consult healthcare provider"
    }));

    res.json(transformedData);
  } catch (error) {
    console.error('UAE drugs API error:', error);
    res.status(500).json({ error: 'Failed to fetch drug data' });
  }
}