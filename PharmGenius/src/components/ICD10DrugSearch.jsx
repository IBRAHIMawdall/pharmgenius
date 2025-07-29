import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Badge,
  Card,
  CardBody,
  Divider,
  Alert,
  AlertIcon,
  Spinner,
  useColorModeValue
} from '@chakra-ui/react';
import icd10DrugService from '../services/icd10DrugService';

const ICD10DrugSearch = () => {
  const [diagnosisQuery, setDiagnosisQuery] = useState('');
  const [drugQuery, setDrugQuery] = useState('');
  const [icd10Results, setIcd10Results] = useState([]);
  const [selectedICD10, setSelectedICD10] = useState(null);
  const [drugResults, setDrugResults] = useState([]);
  const [approvalDoc, setApprovalDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const searchICD10 = async () => {
    if (!diagnosisQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await icd10DrugService.searchICD10(diagnosisQuery);
      setIcd10Results(results);
    } catch (error) {
      console.error('Error searching ICD-10:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectICD10 = (icd10) => {
    setSelectedICD10(icd10);
    setIcd10Results([]);
  };

  const searchDrugs = async () => {
    if (!drugQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await icd10DrugService.searchUAEDrugsWithICD10(
        drugQuery, 
        selectedICD10?.icd10_code
      );
      setDrugResults(results);
    } catch (error) {
      console.error('Error searching drugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateApproval = async (drugCode) => {
    if (!selectedICD10) return;
    
    setLoading(true);
    try {
      const doc = await icd10DrugService.generateApprovalDoc(
        drugCode,
        selectedICD10.icd10_code
      );
      setApprovalDoc(doc);
    } catch (error) {
      console.error('Error generating approval:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* ICD-10 Diagnosis Search */}
      <Card bg={cardBg} borderColor={borderColor}>
        <CardBody>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Step 1: Search Diagnosis (ICD-10)
          </Text>
          <HStack>
            <Input
              placeholder="Enter diagnosis (e.g., Type 2 Diabetes)"
              value={diagnosisQuery}
              onChange={(e) => setDiagnosisQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchICD10()}
            />
            <Button colorScheme="blue" onClick={searchICD10} isLoading={loading}>
              Search
            </Button>
          </HStack>

          {selectedICD10 && (
            <Box mt={4} p={3} bg="blue.50" borderRadius="md">
              <Text fontWeight="bold">Selected Diagnosis:</Text>
              <Text>{selectedICD10.indication}</Text>
              <Badge colorScheme="blue">{selectedICD10.icd10_code}</Badge>
            </Box>
          )}

          {icd10Results.length > 0 && (
            <VStack mt={4} spacing={2} align="stretch">
              {icd10Results.map((result, index) => (
                <Box
                  key={index}
                  p={3}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  cursor="pointer"
                  _hover={{ bg: 'gray.50' }}
                  onClick={() => selectICD10(result)}
                >
                  <HStack justify="space-between">
                    <Text>{result.indication}</Text>
                    <Badge>{result.icd10_code}</Badge>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </CardBody>
      </Card>

      {/* Drug Search */}
      <Card bg={cardBg} borderColor={borderColor}>
        <CardBody>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Step 2: Search Medication
          </Text>
          <HStack>
            <Input
              placeholder="Enter medication name"
              value={drugQuery}
              onChange={(e) => setDrugQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchDrugs()}
            />
            <Button colorScheme="green" onClick={searchDrugs} isLoading={loading}>
              Search
            </Button>
          </HStack>

          {drugResults.length > 0 && (
            <VStack mt={4} spacing={3} align="stretch">
              {drugResults.map((drug, index) => (
                <Box
                  key={index}
                  p={4}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                >
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{drug['Package Name']}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {drug['Generic Name']} - {drug['Strength']}
                      </Text>
                      <HStack>
                        {drug['Included in Thiqa/ ABM - other than 1&7- Drug Formulary'] === 'Yes' && (
                          <Badge colorScheme="green">Thiqa</Badge>
                        )}
                        {drug['Included In Basic Drug Formulary'] === 'Yes' && (
                          <Badge colorScheme="blue">Basic</Badge>
                        )}
                        {drug.icd10Match && (
                          <Badge colorScheme="purple">ICD-10 Match</Badge>
                        )}
                      </HStack>
                    </VStack>
                    <VStack align="end">
                      <Text fontWeight="bold">
                        AED {drug['Package Price to Public']}
                      </Text>
                      <Button
                        size="sm"
                        colorScheme="purple"
                        onClick={() => generateApproval(drug['Drug Code'])}
                      >
                        Check Approval
                      </Button>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </CardBody>
      </Card>

      {/* Insurance Approval Documentation */}
      {approvalDoc && (
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Insurance Approval Information
            </Text>
            
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontWeight="bold">Medication:</Text>
                <Text>{approvalDoc.medication.packageName}</Text>
                <Text fontSize="sm" color="gray.600">
                  Code: {approvalDoc.medication.drugCode}
                </Text>
              </Box>

              <Box>
                <Text fontWeight="bold">Diagnosis:</Text>
                <Text>{approvalDoc.diagnosis.description}</Text>
                <Badge>{approvalDoc.diagnosis.icd10Code}</Badge>
              </Box>

              <Divider />

              <Box>
                <Text fontWeight="bold" mb={2}>Insurance Coverage:</Text>
                <HStack wrap="wrap">
                  <Badge colorScheme={approvalDoc.insuranceInfo.thiqa ? 'green' : 'red'}>
                    Thiqa: {approvalDoc.insuranceInfo.thiqa ? 'Covered' : 'Not Covered'}
                  </Badge>
                  <Badge colorScheme={approvalDoc.insuranceInfo.basic ? 'green' : 'red'}>
                    Basic: {approvalDoc.insuranceInfo.basic ? 'Covered' : 'Not Covered'}
                  </Badge>
                </HStack>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={2}>Cost Breakdown:</Text>
                <VStack align="start" spacing={1}>
                  <Text>Public Price: AED {approvalDoc.costBreakdown.publicPrice}</Text>
                  <Text>Pharmacy Price: AED {approvalDoc.costBreakdown.pharmacyPrice}</Text>
                  {approvalDoc.costBreakdown.thiqaCopay > 0 && (
                    <Text>Thiqa Co-pay: AED {approvalDoc.costBreakdown.thiqaCopay}</Text>
                  )}
                </VStack>
              </Box>

              <Alert status={approvalDoc.preAuthRequired ? 'warning' : 'success'}>
                <AlertIcon />
                {approvalDoc.recommendedAction}
              </Alert>
            </VStack>
          </CardBody>
        </Card>
      )}

      {loading && (
        <Box textAlign="center">
          <Spinner size="lg" />
        </Box>
      )}
    </VStack>
  );
};

export default ICD10DrugSearch;