import { useState, useEffect } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Stack,
  Flex,
  Button,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
} from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { getDrugDetails, checkDamanCoverage } from '../services/drugService'
import DamanCoverage from './DamanCoverage'

export default function DrugDetails() {
  const { id } = useParams()
  const [drug, setDrug] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [damanCoverage, setDamanCoverage] = useState(null)
  const [loadingCoverage, setLoadingCoverage] = useState(false)
  
  useEffect(() => {
    const fetchDrugDetails = async () => {
      try {
        setLoading(true)
        const drugData = await getDrugDetails(id)
        setDrug(drugData)
        
        // Fetch Daman coverage information
        setLoadingCoverage(true)
        try {
          const coverageData = await checkDamanCoverage(drugData.drug_name)
          setDamanCoverage(coverageData)
        } catch (coverageErr) {
          console.error('Failed to fetch Daman coverage:', coverageErr)
          // Don't set main error, just log it
        } finally {
          setLoadingCoverage(false)
        }
      } catch (err) {
        setError('Failed to load drug details. Please try again.')
        console.error('Error fetching drug details:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDrugDetails()
  }, [id])
  
  if (loading) {
    return (
      <Container maxW="6xl" py={10}>
        <Flex justify="center" align="center" minH="50vh">
          <Spinner size="xl" color="brand.500" />
        </Flex>
      </Container>
    )
  }
  
  if (error) {
    return (
      <Container maxW="6xl" py={10}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
        <Button
          as={RouterLink}
          to="/search"
          leftIcon={<ChevronLeftIcon />}
          mt={4}
        >
          Back to Search
        </Button>
      </Container>
    )
  }
  
  if (!drug) {
    return (
      <Container maxW="6xl" py={10}>
        <Alert status="info">
          <AlertIcon />
          Drug not found.
        </Alert>
        <Button
          as={RouterLink}
          to="/search"
          leftIcon={<ChevronLeftIcon />}
          mt={4}
        >
          Back to Search
        </Button>
      </Container>
    )
  }

  return (
    <Container maxW="6xl" py={8}>
      <Button
        as={RouterLink}
        to="/search"
        leftIcon={<ChevronLeftIcon />}
        mb={6}
        variant="outline"
      >
        Back to Search
      </Button>
      
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2}>
          {drug.drug_name}
        </Heading>
        <Text fontSize="lg" color="gray.600" mb={4}>
          {drug.generic_name}
        </Text>
        
        <Flex wrap="wrap" gap={2} mb={6}>
          <Badge colorScheme="blue" fontSize="0.9em" px={2} py={1}>
            {drug.category}
          </Badge>
          {drug.dosage_form && (
            <Badge colorScheme="purple" fontSize="0.9em" px={2} py={1}>
              {drug.dosage_form}
            </Badge>
          )}
          {drug.strength && (
            <Badge colorScheme="green" fontSize="0.9em" px={2} py={1}>
              {drug.strength}
            </Badge>
          )}
        </Flex>
      </Box>
      
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        gap={6}
        align="flex-start"
      >
        <Box flex="1" w={{ base: '100%', lg: '70%' }}>
          <Tabs colorScheme="brand" isLazy>
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Indications</Tab>
              <Tab>Side Effects</Tab>
              <Tab>Contraindications</Tab>
              <Tab>ICD-10 Codes</Tab>
            </TabList>
            
            <TabPanels>
              <TabPanel>
                <Stack spacing={6}>
                  <Box>
                    <Heading as="h3" size="md" mb={3}>
                      Drug Information
                    </Heading>
                    <Text>{drug.generic_name} ({drug.drug_name}) is a medication in the {drug.category} category.</Text>
                    {drug.dosage_form && drug.strength && (
                      <Text mt={2}>
                        Available as {drug.dosage_form}, {drug.strength}.
                      </Text>
                    )}
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Heading as="h3" size="md" mb={3}>
                      Key Information
                    </Heading>
                    <Text>{drug.indications ? drug.indications.substring(0, 300) + '...' : 'No overview information available.'}</Text>
                  </Box>
                </Stack>
              </TabPanel>
              
              <TabPanel>
                <Heading as="h3" size="md" mb={3}>
                  Indications
                </Heading>
                <Text whiteSpace="pre-line">
                  {drug.indications || 'No indications information available.'}
                </Text>
              </TabPanel>
              
              <TabPanel>
                <Heading as="h3" size="md" mb={3}>
                  Side Effects
                </Heading>
                <Text whiteSpace="pre-line">
                  {drug.side_effects || 'No side effects information available.'}
                </Text>
              </TabPanel>
              
              <TabPanel>
                <Heading as="h3" size="md" mb={3}>
                  Contraindications
                </Heading>
                <Text whiteSpace="pre-line">
                  {drug.contraindications || 'No contraindications information available.'}
                </Text>
              </TabPanel>
              
              <TabPanel>
                <Heading as="h3" size="md" mb={3}>
                  ICD-10 Codes
                </Heading>
                {drug.icd10_codes && drug.icd10_codes.length > 0 ? (
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Primary Code</Th>
                        <Th>Secondary Code</Th>
                        <Th>Common Uses</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {drug.icd10_codes.map((code, index) => (
                        <Tr key={index}>
                          <Td>{code.primary}</Td>
                          <Td>{code.secondary || '-'}</Td>
                          <Td>{code.common_uses || '-'}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                ) : (
                  <Text>No ICD-10 codes available for this medication.</Text>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        
        <Box
          w={{ base: '100%', lg: '30%' }}
          position={{ base: 'relative', lg: 'sticky' }}
          top={{ lg: '100px' }}
        >
          <Card
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow="md"
            borderRadius="lg"
            mb={6}
          >
            <CardHeader pb={0}>
              <Heading size="md">Daman Insurance Coverage</Heading>
            </CardHeader>
            <CardBody>
              {loadingCoverage ? (
                <Flex justify="center" py={4}>
                  <Spinner size="md" color="brand.500" />
                </Flex>
              ) : (
                <DamanCoverage coverage={damanCoverage} drugName={drug.drug_name} />
              )}
            </CardBody>
          </Card>
          
          <Card
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow="md"
            borderRadius="lg"
          >
            <CardHeader pb={0}>
              <Heading size="md">Drug Details</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={3}>
                <Flex justify="space-between">
                  <Text fontWeight="medium">Category:</Text>
                  <Text>{drug.category}</Text>
                </Flex>
                {drug.dosage_form && (
                  <Flex justify="space-between">
                    <Text fontWeight="medium">Dosage Form:</Text>
                    <Text>{drug.dosage_form}</Text>
                  </Flex>
                )}
                {drug.strength && (
                  <Flex justify="space-between">
                    <Text fontWeight="medium">Strength:</Text>
                    <Text>{drug.strength}</Text>
                  </Flex>
                )}
                <Flex justify="space-between">
                  <Text fontWeight="medium">Last Updated:</Text>
                  <Text>{new Date(drug.updated_at).toLocaleDateString()}</Text>
                </Flex>
              </Stack>
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </Container>
  )
}