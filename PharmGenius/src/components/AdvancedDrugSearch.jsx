import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useColorModeValue,
  Heading,
  Text,
  Divider,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { FaSearch, FaRedo } from 'react-icons/fa';

const AdvancedDrugSearch = ({ onSearch, onReset }) => {
  const [searchParams, setSearchParams] = useState({
    diagnosis: '',
    tradeName: '',
    genericName: '',
    drugCode: '',
    manufacturer: '',
    dosageForm: '',
    strength: ''
  });

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    onSearch(searchParams);
  };

  const handleReset = () => {
    setSearchParams({
      diagnosis: '',
      tradeName: '',
      genericName: '',
      drugCode: '',
      manufacturer: '',
      dosageForm: '',
      strength: ''
    });
    onReset();
  };

  return (
    <Box bg={bgColor} borderRadius="lg" p={6} shadow="md" borderWidth="1px" borderColor={borderColor}>
      <VStack spacing={6} align="stretch">
        
        {/* Reset Process */}
        <Box>
          <Button
            leftIcon={<FaRedo />}
            onClick={handleReset}
            colorScheme="gray"
            variant="outline"
            size="sm"
            mb={4}
          >
            Reset Process
          </Button>
        </Box>

        {/* Search Parameters */}
        <Box>
          <Heading size="md" mb={4} color="brand.500">
            Search Parameters
          </Heading>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Diagnosis (e.g., 'Kdlo')</FormLabel>
              <Input
                placeholder="Enter diagnosis or condition"
                value={searchParams.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              />
            </FormControl>
            
            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Trade Name</FormLabel>
                <Input
                  placeholder="Brand name"
                  value={searchParams.tradeName}
                  onChange={(e) => handleInputChange('tradeName', e.target.value)}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Generic Name</FormLabel>
                <Input
                  placeholder="Generic name"
                  value={searchParams.genericName}
                  onChange={(e) => handleInputChange('genericName', e.target.value)}
                />
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Drug Code</FormLabel>
                <Input
                  placeholder="UAE drug code"
                  value={searchParams.drugCode}
                  onChange={(e) => handleInputChange('drugCode', e.target.value)}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Manufacturer</FormLabel>
                <Input
                  placeholder="Manufacturer name"
                  value={searchParams.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                />
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Dosage Form</FormLabel>
                <Select
                  placeholder="Select dosage form"
                  value={searchParams.dosageForm}
                  onChange={(e) => handleInputChange('dosageForm', e.target.value)}
                >
                  <option value="Tablets">Tablets</option>
                  <option value="Capsules">Capsules</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                  <option value="Cream">Cream</option>
                  <option value="Ointment">Ointment</option>
                  <option value="Drops">Drops</option>
                  <option value="Inhaler">Inhaler</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Strength</FormLabel>
                <Input
                  placeholder="e.g., 500mg"
                  value={searchParams.strength}
                  onChange={(e) => handleInputChange('strength', e.target.value)}
                />
              </FormControl>
            </HStack>
          </VStack>
        </Box>

        <Divider />

        {/* Resources */}
        <Box>
          <Heading size="md" mb={4} color="brand.500">
            Resources
          </Heading>
          <VStack spacing={2} align="stretch">
            <HStack>
              <Badge colorScheme="green">✓</Badge>
              <Text>Vale Druglist - UAE Official Registry</Text>
            </HStack>
            <HStack>
              <Badge colorScheme="green">✓</Badge>
              <Text>Free API servers for ICD-10</Text>
            </HStack>
            <HStack>
              <Badge colorScheme="green">✓</Badge>
              <Text>Available data sources - 21,322 medications</Text>
            </HStack>
          </VStack>
        </Box>

        <Divider />

        {/* Required Info for Approval */}
        <Box>
          <Heading size="md" mb={4} color="brand.500">
            Required Info for Approval
          </Heading>
          <VStack spacing={2} align="stretch">
            <HStack>
              <Badge colorScheme="blue">📋</Badge>
              <Text>Drug Description</Text>
            </HStack>
            <HStack>
              <Badge colorScheme="blue">🏥</Badge>
              <Text>ICD-10 Code</Text>
            </HStack>
            <HStack>
              <Badge colorScheme="blue">ℹ️</Badge>
              <Text>Basic Info</Text>
            </HStack>
            <HStack>
              <Badge colorScheme="red">⚠️</Badge>
              <Text>Contraindications</Text>
            </HStack>
          </VStack>
        </Box>

        {/* Search Button */}
        <Button
          leftIcon={<FaSearch />}
          onClick={handleSearch}
          colorScheme="brand"
          size="lg"
          isDisabled={!searchParams.tradeName && !searchParams.genericName && !searchParams.diagnosis}
        >
          Search Medications
        </Button>
      </VStack>
    </Box>
  );
};

export default AdvancedDrugSearch;