// Import the data directly
import formularyData from '../daman-formulary.json' assert { type: 'json' };

export default function handler(req, res) {
  try {
    const data = formularyData;
    
    // Get the drug name from the query
    const { drug } = req.query;
    
    if (!drug) {
      return res.status(200).json(data);
    }
    
    // Filter medications based on the drug name
    const filteredMedications = data.medications.filter(
      (item) =>
        item.name.toLowerCase().includes(drug.toLowerCase()) ||
        (item.activeIngredient &&
          item.activeIngredient.toLowerCase().includes(drug.toLowerCase()))
    );
    
    return res.status(200).json({ medications: filteredMedications });
  } catch (error) {
    console.error('Error reading formulary data:', error);
    return res.status(500).json({ error: 'Failed to fetch formulary data' });
  }
}