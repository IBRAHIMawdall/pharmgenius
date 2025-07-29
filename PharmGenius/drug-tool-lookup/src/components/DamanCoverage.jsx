import {
  Box,
  Flex,
  Text,
  Badge,
  Alert,
  AlertIcon,
  Stack,
  Divider,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'

// Mock data for demonstration - this would be replaced by actual API data
const MOCK_COVERAGE = {
  "paracetamol": {
    thiqa: true,
    basic: true,
    enhanced: true,
    priorAuthorization: false
  },
  "insulin glargine": {
    thiqa: true,
    basic: false,
    enhanced: true,
    priorAuthorization: true,
    alternatives: ["insulin detemir", "insulin degludec"]
  },
  "atorvastatin": {
    thiqa: true,
    basic: true,
    enhanced: true,
    priorAuthorization: false
  },
  "adalimumab": {
    thiqa: true,
    basic: false,
    enhanced: false,
    priorAuthorization: true
  }
}

export default function DamanCoverage({ coverage, drugName }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  // If we have real coverage data, use it; otherwise, try to use mock data
  const drugCoverage = coverage || MOCK_COVERAGE[drugName?.toLowerCase()]
  
  if (!drugCoverage) {
    return (
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        Insurance coverage information not available for this medication.
      </Alert>
    )
  }

  return (
    <Box>
      <Stack spacing={3}>
        <CoverageItem plan="Thiqa" covered={drugCoverage.thiqa} />
        <CoverageItem plan="Basic" covered={drugCoverage.basic} />
        <CoverageItem plan="Enhanced" covered={drugCoverage.enhanced} />
      </Stack>
      
      {drugCoverage.priorAuthorization && (
        <Alert status="warning" mt={4} borderRadius="md">
          <AlertIcon />
          Prior Authorization Required
        </Alert>
      )}
      
      {drugCoverage.price_public && (
        <>
          <Divider my={4} />
          <Text fontWeight="medium" mb={2}>
            Price Information:
          </Text>
          <Text fontSize="sm">
            Public Price: AED {drugCoverage.price_public}
          </Text>
          {drugCoverage.manufacturer && (
            <Text fontSize="sm" color="gray.600">
              Manufacturer: {drugCoverage.manufacturer}
            </Text>
          )}
        </>
      )}
      
      {drugCoverage.alternatives && drugCoverage.alternatives.length > 0 && (
        <>
          <Divider my={4} />
          <Text fontWeight="medium" mb={2}>
            Covered Alternatives:
          </Text>
          <Stack>
            {drugCoverage.alternatives.map((alt, index) => (
              <Text key={index} fontSize="sm">
                • {alt}
              </Text>
            ))}
          </Stack>
        </>
      )}
      
      <Button
        size="sm"
        colorScheme="brand"
        variant="outline"
        mt={4}
        onClick={onOpen}
        width="100%"
      >
        View Coverage Details
      </Button>
      
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Daman Insurance Coverage Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Coverage information for <strong>{drugName}</strong>:
            </Text>
            
            <Box mb={6}>
              <Text fontWeight="bold" mb={2}>
                Coverage Status:
              </Text>
              <Stack spacing={3}>
                <CoverageItem plan="Thiqa" covered={drugCoverage.thiqa} showDetails />
                <CoverageItem plan="Basic" covered={drugCoverage.basic} showDetails />
                <CoverageItem plan="Enhanced" covered={drugCoverage.enhanced} showDetails />
              </Stack>
            </Box>
            
            {drugCoverage.priorAuthorization && (
              <Box mb={6}>
                <Text fontWeight="bold" mb={2}>
                  Prior Authorization:
                </Text>
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="medium">Prior Authorization Required</Text>
                    <Text fontSize="sm" mt={1}>
                      This medication requires prior authorization from Daman Insurance.
                      Please submit the appropriate form to request coverage approval.
                    </Text>
                  </Box>
                </Alert>
              </Box>
            )}
            
            {drugCoverage.alternatives && drugCoverage.alternatives.length > 0 && (
              <Box mb={6}>
                <Text fontWeight="bold" mb={2}>
                  Covered Alternatives:
                </Text>
                <Stack>
                  {drugCoverage.alternatives.map((alt, index) => (
                    <Text key={index}>• {alt}</Text>
                  ))}
                </Stack>
              </Box>
            )}
            
            <Box>
              <Text fontWeight="bold" mb={2}>
                Coverage Notes:
              </Text>
              <Text fontSize="sm">
                Coverage information is based on the latest Daman formulary data.
                Actual coverage may vary based on individual policy details and
                changes to the formulary. Please verify with Daman Insurance for
                the most current information.
              </Text>
            </Box>
          </ModalBody>
          
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="outline">Download Coverage Info</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

function CoverageItem({ plan, covered, showDetails = false }) {
  const planColors = {
    Thiqa: 'teal',
    Basic: 'blue',
    Enhanced: 'purple'
  }
  
  return (
    <Flex align="center" justify="space-between">
      <Flex align="center">
        <Text fontWeight="medium" mr={2}>
          {plan}:
        </Text>
        {showDetails && (
          <Text fontSize="sm" color="gray.500">
            {plan === 'Thiqa' && 'UAE Nationals'}
            {plan === 'Basic' && 'Mandatory coverage'}
            {plan === 'Enhanced' && 'Premium coverage'}
          </Text>
        )}
      </Flex>
      {covered ? (
        <Badge colorScheme="green" px={2} py={0.5}>
          Covered
        </Badge>
      ) : (
        <Badge colorScheme="red" px={2} py={0.5}>
          Not Covered
        </Badge>
      )}
    </Flex>
  )
}