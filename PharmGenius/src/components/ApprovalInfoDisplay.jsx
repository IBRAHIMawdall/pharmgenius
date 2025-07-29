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
        <Box>
          <Heading size="md" mb={4} color="brand.500">
            Drug Description
          </Heading>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="bold">Trade Name:</Text>
              <HStack>
                <Code>{medication.name}</Code>
                <Button size="xs" onClick={() => copyToClipboard(medication.name, 'Trade name')}>
                  <FaCopy />
                </Button>
              </HStack>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="bold">Generic Name:</Text>
              <HStack>
                <Code>{medication.genericName}</Code>
                <Button size="xs" onClick={() => copyToClipboard(medication.genericName, 'Generic name')}>
                  <FaCopy />
                </Button>
              </HStack>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="bold">Strength:</Text>
              <Text>{medication.strength}</Text>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="bold">Dosage Form:</Text>
              <Text>{medication.dosageForm}</Text>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="bold">Drug Code:</Text>
              <HStack>
                <Code>{medication.drugCode}</Code>
                <Button size="xs" onClick={() => copyToClipboard(medication.drugCode, 'Drug code')}>
                  <FaCopy />
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </Box>

        <Divider />

        {/* ICD-10 Codes */}
        <Box>
          <Heading size="md" mb={4} color="brand.500">
            ICD-10 Codes for Insurance Approval
          </Heading>
          {icdCodes && icdCodes.length > 0 ? (
            <VStack spacing={3} align="stretch">
              {icdCodes.map((code, index) => (
                <HStack key={index} justify="space-between" p={3} borderWidth="1px" borderRadius="md">
                  <VStack align="start" spacing={1}>
                    <HStack>
                      <Badge colorScheme="brand" fontSize="md">{code.code}</Badge>
                      <Button size="xs" onClick={() => copyToClipboard(code.code, 'ICD-10 code')}>
                        <FaCopy />
                      </Button>
                    </HStack>
                    <Text fontSize="sm">{code.description}</Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          ) : (
            <Alert status="info">
              <AlertIcon />
              No ICD-10 codes available for this medication
            </Alert>
          )}
        </Box>

        <Divider />

        {/* Basic Info */}
        <Box>
          <Heading size="md" mb={4} color="brand.500">
            Basic Information
          </Heading>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="bold">Manufacturer:</Text>
              <Text>{medication.manufacturer}</Text>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="bold">Package Size:</Text>
              <Text>{medication.packageSize}</Text>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="bold">Dispense Mode:</Text>
              <Badge colorScheme={medication.dispenseMode?.includes('Controlled') ? 'red' : 'green'}>
                {medication.dispenseMode}
              </Badge>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="bold">Package Price:</Text>
              <Text fontWeight="bold" color="brand.500">AED {medication.packagePricePublic}</Text>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="bold">Unit Price:</Text>
              <Text>AED {medication.unitPricePublic}</Text>
            </HStack>
          </VStack>
        </Box>

        <Divider />

        {/* Insurance Coverage */}
        <Box>
          <Heading size="md" mb={4} color="brand.500">
            Insurance Coverage Status
          </Heading>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="bold">Thiqa Plan:</Text>
              <Badge colorScheme={medication.thiqa ? 'green' : 'red'}>
                {medication.thiqa ? 'Covered' : 'Not Covered'}
              </Badge>
            </HStack>
            
            <HStack justify="space-between">
              <Text fontWeight="bold">Basic Plan:</Text>
              <Badge colorScheme={medication.basic ? 'green' : 'red'}>
                {medication.basic ? 'Covered' : 'Not Covered'}
              </Badge>
            </HStack>
            
            {medication.priorAuthorization && (
              <Alert status="warning">
                <AlertIcon />
                Prior Authorization Required
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