import { useState } from 'react';
import { Box, Container, HStack, useColorModeValue } from '@chakra-ui/react';
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
    try {
      const response = await axios.get('/daman-formulary.json');
      const allMedications = response.data.medications;
      
      let filtered = allMedications.filter(med => {
        const matchesTrade = !searchParams.tradeName || 
          med.name.toLowerCase().includes(searchParams.tradeName.toLowerCase());
        const matchesGeneric = !searchParams.genericName || 
          med.genericName.toLowerCase().includes(searchParams.genericName.toLowerCase());
        const matchesDrugCode = !searchParams.drugCode || 
          med.drugCode.includes(searchParams.drugCode);
        const matchesManufacturer = !searchParams.manufacturer || 
          med.manufacturer.toLowerCase().includes(searchParams.manufacturer.toLowerCase());
        const matchesDosageForm = !searchParams.dosageForm || 
          med.dosageForm.toLowerCase().includes(searchParams.dosageForm.toLowerCase());
        const matchesStrength = !searchParams.strength || 
          med.strength.toLowerCase().includes(searchParams.strength.toLowerCase());
        
        return matchesTrade && matchesGeneric && matchesDrugCode && 
               matchesManufacturer && matchesDosageForm && matchesStrength;
      });
      
      if (filtered.length > 0) {
        const medication = filtered[0];
        setSelectedMedication(medication);
        
        try {
          const icdResponse = await axios.get('/icd10-data.json');
          const drugLower = medication.genericName.toLowerCase();
          const codes = icdResponse.data[drugLower] || [];
          setIcdCodes(codes);
        } catch (error) {
          setIcdCodes([]);
        }
      } else {
        setSelectedMedication(null);
        setIcdCodes([]);
      }
    } catch (error) {
      console.error('Search error:', error);
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
      <Container maxW="container.xl" flex="1" py={8}>
        <HStack spacing={8} align="start">
          <Box flex="1">
            <AdvancedDrugSearch onSearch={handleSearch} onReset={handleReset} />
          </Box>
          <Box flex="1">
            <ApprovalInfoDisplay medication={selectedMedication} icdCodes={icdCodes} />
          </Box>
        </HStack>
      </Container>
      <Footer />
    </Box>
  );
}

export default App;