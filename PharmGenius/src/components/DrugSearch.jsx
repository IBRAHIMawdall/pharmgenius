import { useState } from 'react';
import {
  Box,
  Input,
  Button,
  FormControl,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Text,
  Heading,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const DrugSearch = ({ setSearchResults, setSearchedDrug }) => {
  const [drugName, setDrugName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!drugName.trim()) return;

    setIsLoading(true);
    setSearchedDrug(drugName);
    try {
      const response = await axios.get('/daman-formulary.json');
      const allMedications = response.data.medications;
      const filtered = allMedications.filter(
        (item) =>
          item.name.toLowerCase().includes(drugName.toLowerCase()) ||
          (item.activeIngredient &&
            item.activeIngredient.toLowerCase().includes(drugName.toLowerCase()))
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error('Error fetching formulary data:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box mb={8}>
      <Box textAlign="center" mb={6}>
        <Heading as="h2" size="xl" mb={2} color="brand.500">
          PharmGenius
        </Heading>
        <Text fontSize="lg" color="gray.500">
          Search for medications to find insurance coverage, ICD-10 codes, and safety information
        </Text>
      </Box>
      
      <Box as="form" onSubmit={handleSearch} maxW="600px" mx="auto">
        <FormControl>
          <InputGroup size="lg">
            <Input
              placeholder="Search for a drug (e.g., Metformin)"
              value={drugName}
              onChange={(e) => setDrugName(e.target.value)}
              pr="4.5rem"
              focusBorderColor="brand.500"
              bg={useColorModeValue('white', 'gray.700')}
              size="lg"
              boxShadow="sm"
              fontSize="lg"
            />
            <InputRightElement width="4.5rem">
              <Button 
                h="1.75rem" 
                size="sm" 
                type="submit" 
                isLoading={isLoading} 
                colorScheme="brand"
                leftIcon={<FaSearch />}
              >
                Search
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </Box>
    </Box>
  );
};

export default DrugSearch;