import {
  Box,
  Heading,
  VStack,
  Alert,
  AlertIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import CoverageItem from './CoverageItem';

const DamanCoverage = ({ drug }) => {
  if (!drug) return null;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      bg={useColorModeValue('gray.50', 'gray.700')}
    >
      <Heading size="md" mb={4}>
        Daman Insurance Coverage
      </Heading>

      <VStack spacing={3} align="stretch">
        <CoverageItem plan="Thiqa" isCovered={drug.thiqa} />
        <CoverageItem plan="Basic" isCovered={drug.basic} />
        <CoverageItem plan="Enhanced" isCovered={drug.enhanced} />
      </VStack>

      {drug.priorAuthorization && (
        <Alert status="warning" mt={4} borderRadius="md">
          <AlertIcon />
          Prior Authorization Required
        </Alert>
      )}
    </Box>
  );
};

export default DamanCoverage;