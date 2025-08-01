import { useState } from 'react';
import { Box, VStack, useColorModeValue } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import AdvancedDrugSearch from './components/AdvancedDrugSearch';
import ApprovalInfoDisplay from './components/ApprovalInfoDisplay';
import axios from 'axios';

function App() {
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [icdCodes, setIcdCodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    setSelectedMedication(null);
    setIcdCodes([]);

    try {
      // Step 1: Use the search API to find the drug's ID
      const searchResponse = await axios.get('/api/drug-service/search', {
        params: {
          query: searchParams.query,
          limit: 1
        }
      });
      
      const { results } = searchResponse.data;
      
      if (results && results.length > 0) {
        const topResult = results[0];
        
        // Step 2: Fetch the full details for that specific drug using its ID
        const detailsResponse = await axios.get(`/api/drug-service/drugs/${topResult.id}`);
        const drugDetails = detailsResponse.data;

        // Map the detailed backend data to the format expected by ApprovalInfoDisplay
        const medicationDetails = {
          name: drugDetails.drug_name,
          activeIngredient: drugDetails.generic_name,
          dosageForm: drugDetails.dosage_form,
          strength: drugDetails.strength,
          manufacturer: drugDetails.manufacturer,
          price_public: drugDetails.price_public,
          thiqa: drugDetails.thiqa_coverage,
          basic: drugDetails.basic_coverage,
          enhanced: drugDetails.abm1_coverage || drugDetails.abm7_coverage,
          priorAuthorization: false, // Placeholder: This can be added to the drug details endpoint later
          drugCode: `ID-${drugDetails.id}`
        };
        setSelectedMedication(medicationDetails);
        
        // NOTE: The /api/icd10-codes endpoint is part of the microservices vision
        // but is not implemented in the current monolithic server. This would be a future enhancement.
        setIcdCodes(drugDetails.icd10_codes || []);
      } else {
        setSelectedMedication(null);
        setIcdCodes([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSelectedMedication(null);
      setIcdCodes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedMedication(null);
    setIcdCodes([]);
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Header />
      <Box flex="1" py={8} px={4} w="100%">
        <VStack spacing={8} align="stretch" w="100%" maxW="none">
          <Box w="100%">
            <AdvancedDrugSearch onSearch={handleSearch} onReset={handleReset} />
          </Box>
          <Box w="100%">
            <ApprovalInfoDisplay medication={selectedMedication} icdCodes={icdCodes} />
          </Box>
        </VStack>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;