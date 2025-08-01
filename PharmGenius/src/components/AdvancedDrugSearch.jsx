import { useState } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  FormControl,
  useColorModeValue,
  Heading,
  List,
  ListItem,
  Text,
} from '@chakra-ui/react';
import { FaSearch } from 'react-icons/fa';

const AdvancedDrugSearch = ({ onSearch, onReset }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const mockSuggestions = [
    '💊 Xifaxan',
    '💊 Rifaximin',
    '💊 Paracetamol',
    '💊 Panadol',
    '💊 Glucophage',
    '💊 Augmentin',
    '💊 Lipitor',
    '🩺 Diabetes',
    '🩺 Hypertension',
    '🏭 GSK',
    '🏭 Pfizer'
  ];

  const handleInputChange = (value) => {
    setSearchQuery(value);
    if (value.length > 1) {
      const filtered = mockSuggestions.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    onSearch({ query: searchQuery });
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    onSearch({ query: suggestion });
  };

  return (
    <Box bg={bgColor} borderRadius="lg" p={6} shadow="md" borderWidth="1px" borderColor={borderColor}>
      <VStack spacing={6} align="stretch">
        <Box bg="teal.50" p={6} borderRadius="xl" border="2px solid" borderColor="teal.200">
          <Heading size="lg" mb={6} color="teal.700" textAlign="center">
            🔍 Search UAE Drug Registry
          </Heading>
          
          <Box position="relative">
            <FormControl>
              <Input
                size="lg"
                placeholder="Enter drug name, diagnosis, code, or manufacturer"
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                bg="white"
                border="2px solid"
                borderColor="gray.200"
                _focus={{ borderColor: "teal.400", bg: "white" }}
                fontSize="lg"
                p={6}
              />
            </FormControl>
            
            {showSuggestions && suggestions.length > 0 && (
              <Box
                position="absolute"
                top="100%"
                left={0}
                right={0}
                bg="white"
                border="2px solid"
                borderColor="teal.200"
                borderRadius="lg"
                shadow="lg"
                zIndex={10}
                mt={2}
              >
                <List spacing={0}>
                  {suggestions.map((suggestion, index) => (
                    <ListItem
                      key={index}
                      p={3}
                      cursor="pointer"
                      _hover={{ bg: "teal.50" }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      borderBottom={index < suggestions.length - 1 ? "1px solid" : "none"}
                      borderColor="gray.100"
                    >
                      <Text fontWeight="semibold" fontSize="sm">{suggestion}</Text>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </Box>

        <Button
          leftIcon={<FaSearch />}
          onClick={handleSearch}
          colorScheme="teal"
          size="lg"
          width="100%"
          height="60px"
          fontSize="lg"
          fontWeight="semibold"
          borderRadius="lg"
          shadow="md"
          _hover={{ transform: "translateY(-1px)", shadow: "lg", bg: "teal.600" }}
          isDisabled={!searchQuery.trim()}
          bg="teal.500"
        >
          🔍 Search UAE Drug Registry
        </Button>
      </VStack>
    </Box>
  );
};

export default AdvancedDrugSearch;