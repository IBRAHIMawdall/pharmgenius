import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Heading,
  Divider,
  Alert,
  AlertIcon,
  Code,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  useToast,
} from '@chakra-ui/react';
import { FaCopy, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const ApprovalInfoDisplay = ({ medication, icdCodes }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const toast = useToast();

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    });
  };

  if (!medication) return null;

  return (
    <Box bg={bgColor} borderRadius="lg" p={6} shadow="md" borderWidth="1px" borderColor={borderColor}>
      <VStack spacing={6} align="stretch">
        
        {/* Drug Description */}
        <Box bg="teal.50" p={6} borderRadius="xl" border="2px solid" borderColor="teal.200">
          <HStack justify="space-between" align="center" mb={6}>
            <Heading size="lg" color="teal.700">
              💊 Drug Description
            </Heading>
            <Button size="sm" colorScheme="teal" variant="outline" onClick={() => copyToClipboard(`Trade Name: ${medication.name}\nGeneric Name: ${medication.genericName}\nStrength: ${medication.strength}\nForm: ${medication.dosageForm}\nUAE Code: ${medication.drugCode}`, 'Drug description')}>
              📋 Copy All
            </Button>
          </HStack>
          <VStack spacing={4} align="stretch">
            <Box bg="white" p={4} borderRadius="lg" shadow="sm">
              <HStack justify="space-between" align="center">
                <Text fontWeight="bold" color="gray.700">🏷️ Trade Name:</Text>
                <HStack>
                  <Code colorScheme="teal" fontSize="sm" p={2}>{medication.name}</Code>
                  <Button size="sm" colorScheme="teal" variant="ghost" onClick={() => copyToClipboard(medication.name, 'Trade name')}>
                    📋
                  </Button>
                </HStack>
              </HStack>
            </Box>
            
            <Box bg="white" p={4} borderRadius="lg" shadow="sm">
              <HStack justify="space-between" align="center">
                <Text fontWeight="bold" color="gray.700">🧬 Generic Name:</Text>
                <HStack>
                  <Code colorScheme="teal" fontSize="sm" p={2}>{medication.genericName}</Code>
                  <Button size="sm" colorScheme="teal" variant="ghost" onClick={() => copyToClipboard(medication.genericName, 'Generic name')}>
                    📋
                  </Button>
                </HStack>
              </HStack>
            </Box>
            
            <HStack spacing={4}>
              <Box bg="white" p={4} borderRadius="lg" shadow="sm" flex="1">
                <HStack justify="space-between">
                  <Text fontWeight="bold" color="gray.700">⚖️ Strength:</Text>
                  <HStack>
                    <Badge colorScheme="purple" fontSize="sm" p={2}>{medication.strength}</Badge>
                    <Button size="sm" colorScheme="purple" variant="ghost" onClick={() => copyToClipboard(medication.strength, 'Strength')}>
                      📋
                    </Button>
                  </HStack>
                </HStack>
              </Box>
              
              <Box bg="white" p={4} borderRadius="lg" shadow="sm" flex="1">
                <HStack justify="space-between">
                  <Text fontWeight="bold" color="gray.700">📋 Form:</Text>
                  <HStack>
                    <Badge colorScheme="orange" fontSize="sm" p={2}>{medication.dosageForm}</Badge>
                    <Button size="sm" colorScheme="orange" variant="ghost" onClick={() => copyToClipboard(medication.dosageForm, 'Dosage form')}>
                      📋
                    </Button>
                  </HStack>
                </HStack>
              </Box>
            </HStack>
            
            <Box bg="white" p={4} borderRadius="lg" shadow="sm">
              <HStack justify="space-between" align="center">
                <Text fontWeight="bold" color="gray.700">🇦🇪 UAE Drug Code:</Text>
                <HStack>
                  <Code colorScheme="red" fontSize="sm" p={2}>{medication.drugCode}</Code>
                  <Button size="sm" colorScheme="red" variant="ghost" onClick={() => copyToClipboard(medication.drugCode, 'Drug code')}>
                    📋
                  </Button>
                </HStack>
              </HStack>
            </Box>
          </VStack>
        </Box>

        <Divider />

        {/* ICD-10 Codes */}
        <Box bg="teal.50" p={6} borderRadius="xl" border="2px solid" borderColor="teal.200">
          <HStack justify="space-between" align="center" mb={6}>
            <Heading size="lg" color="teal.700">
              🏥 ICD-10 Codes
            </Heading>
            {icdCodes && icdCodes.length > 0 && (
              <Button size="sm" colorScheme="teal" variant="outline" onClick={() => copyToClipboard(icdCodes.map(code => `${code.code} - ${code.description}`).join('\n'), 'ICD-10 codes')}>
                📋 Copy All
              </Button>
            )}
          </HStack>
          {icdCodes && icdCodes.length > 0 ? (
            <VStack spacing={3} align="stretch">
              {icdCodes.map((code, index) => (
                <Box key={index} bg="white" p={4} borderRadius="lg" shadow="sm">
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1} flex="1">
                      <Badge colorScheme="teal" fontSize="sm" p={2}>{code.code}</Badge>
                      <Text fontSize="xs" color="gray.600">{code.description}</Text>
                    </VStack>
                    <Button size="sm" colorScheme="teal" variant="ghost" onClick={() => copyToClipboard(`${code.code} - ${code.description}`, 'ICD-10 code')}>
                      📋
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          ) : (
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              No ICD-10 codes available for this medication
            </Alert>
          )}
        </Box>

        <Divider />



        <Divider />

        {/* Insurance Coverage */}
        <Box bg="purple.50" p={6} borderRadius="xl" border="2px solid" borderColor="purple.200">
          <HStack justify="space-between" align="center" mb={6}>
            <Heading size="lg" color="purple.600">
              🏥 Insurance Coverage Status
            </Heading>
            <Button 
              size="sm" 
              colorScheme="purple" 
              variant="outline" 
              onClick={() => copyToClipboard(
                `Thiqa Plan: ${medication.thiqa ? 'Covered' : 'Not Covered'}\nBasic Plan: ${medication.basic ? 'Covered' : 'Not Covered'}\nEnhanced Plan: ${medication.enhanced ? 'Covered' : 'Not Covered'}`, 
                'Insurance coverage'
              )}
            >
              📋 Copy All
            </Button>
          </HStack>
          <VStack spacing={4} align="stretch">
            <Box bg="white" p={5} borderRadius="lg" shadow="md" border="2px solid" borderColor={medication.thiqa ? 'green.200' : 'red.200'}>
              <HStack justify="space-between" align="center">
                <HStack>
                  <Text fontSize="2xl">🇦🇪</Text>
                  <Text fontWeight="bold" fontSize="lg" color="gray.700">Thiqa Plan:</Text>
                </HStack>
                <HStack>
                  <Badge 
                    colorScheme={medication.thiqa ? 'green' : 'red'} 
                    fontSize="lg" 
                    p={3} 
                    borderRadius="full"
                  >
                    {medication.thiqa ? '✅ Covered' : '❌ Not Covered'}
                  </Badge>
                  <Button 
                    size="sm" 
                    colorScheme={medication.thiqa ? 'green' : 'red'} 
                    variant="ghost" 
                    onClick={() => copyToClipboard(`Thiqa Plan: ${medication.thiqa ? 'Covered' : 'Not Covered'}`, 'Thiqa coverage')}
                  >
                    📋
                  </Button>
                </HStack>
              </HStack>
            </Box>
            
            <Box bg="white" p={5} borderRadius="lg" shadow="md" border="2px solid" borderColor={medication.basic ? 'green.200' : 'red.200'}>
              <HStack justify="space-between" align="center">
                <HStack>
                  <Text fontSize="2xl">🏥</Text>
                  <Text fontWeight="bold" fontSize="lg" color="gray.700">Basic Plan:</Text>
                </HStack>
                <HStack>
                  <Badge 
                    colorScheme={medication.basic ? 'green' : 'red'} 
                    fontSize="lg" 
                    p={3} 
                    borderRadius="full"
                  >
                    {medication.basic ? '✅ Covered' : '❌ Not Covered'}
                  </Badge>
                  <Button 
                    size="sm" 
                    colorScheme={medication.basic ? 'green' : 'red'} 
                    variant="ghost" 
                    onClick={() => copyToClipboard(`Basic Plan: ${medication.basic ? 'Covered' : 'Not Covered'}`, 'Basic coverage')}
                  >
                    📋
                  </Button>
                </HStack>
              </HStack>
            </Box>
            
            <Box bg="white" p={5} borderRadius="lg" shadow="md" border="2px solid" borderColor={medication.enhanced ? 'green.200' : 'red.200'}>
              <HStack justify="space-between" align="center">
                <HStack>
                  <Text fontSize="2xl">💎</Text>
                  <Text fontWeight="bold" fontSize="lg" color="gray.700">Enhanced Plan:</Text>
                </HStack>
                <HStack>
                  <Badge 
                    colorScheme={medication.enhanced ? 'green' : 'red'} 
                    fontSize="lg" 
                    p={3} 
                    borderRadius="full"
                  >
                    {medication.enhanced ? '✅ Covered' : '❌ Not Covered'}
                  </Badge>
                  <Button 
                    size="sm" 
                    colorScheme={medication.enhanced ? 'green' : 'red'} 
                    variant="ghost" 
                    onClick={() => copyToClipboard(`Enhanced Plan: ${medication.enhanced ? 'Covered' : 'Not Covered'}`, 'Enhanced coverage')}
                  >
                    📋
                  </Button>
                </HStack>
              </HStack>
            </Box>
            
            {medication.priorAuthorization && (
              <Alert status="warning" borderRadius="lg" p={4}>
                <AlertIcon boxSize={6} />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">Prior Authorization Required</Text>
                  <Text fontSize="sm">Contact insurance provider before dispensing</Text>
                </VStack>
              </Alert>
            )}
          </VStack>
        </Box>

        {/* Contraindications */}
        {medication.contraindications && (
          <>
            <Divider />
            <Box>
              <Heading size="md" mb={4} color="red.500">
                <HStack>
                  <FaExclamationTriangle />
                  <Text>Contraindications</Text>
                </HStack>
              </Heading>
              <Alert status="error">
                <AlertIcon />
                <Text>{medication.contraindications}</Text>
              </Alert>
            </Box>
          </>
        )}

      </VStack>
    </Box>
  );
};

export default ApprovalInfoDisplay;