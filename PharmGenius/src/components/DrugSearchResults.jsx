import { Box, Heading, Text, VStack, Tabs, TabList, TabPanels, Tab, TabPanel, Badge, Flex, useColorModeValue } from '@chakra-ui/react';
import DamanCoverage from './DamanCoverage';
import ICD10Results from './ICD10Results';
import PregnancySafety from './PregnancySafety';
import DrugInteractions from './DrugInteractions';

const DrugSearchResults = ({ results, searchedDrug }) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  
  if (results.length === 0 && searchedDrug) {
    return (
      <Box textAlign="center" p={5} borderWidth="1px" borderRadius="lg" bg={bgColor}>
        <Heading size="md">No Results Found</Heading>
        <Text mt={2}>
          No coverage information found for "<strong>{searchedDrug}</strong>".
        </Text>
      </Box>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <VStack spacing={6} align="stretch">
      {results.map((drug, index) => (
        <Box key={index} shadow="md" borderWidth="1px" borderRadius="lg" overflow="hidden" bg={bgColor}>
          <Box p={5} borderBottomWidth="1px">
            <Heading size="lg" mb={2}>
              {drug.name}
            </Heading>
            <Flex alignItems="center" mb={2}>
              <Text fontSize="md" color="gray.500" mr={2}>
                Active Ingredient:
              </Text>
              <Badge colorScheme="brand" fontSize="md">{drug.activeIngredient}</Badge>
            </Flex>
            <Flex alignItems="center">
              <Text fontSize="md" color="gray.500" mr={2}>
                Dosage Form:
              </Text>
              <Text>{drug.dosageForm} {drug.strength}</Text>
            </Flex>
          </Box>
          
          <Tabs colorScheme="brand" isLazy>
            <TabList px={5} pt={2}>
              <Tab>Coverage</Tab>
              <Tab>ICD-10 Codes</Tab>
              <Tab>Pregnancy</Tab>
              <Tab>Interactions</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <DamanCoverage drug={drug} />
              </TabPanel>
              <TabPanel>
                <ICD10Results drugName={drug.name} />
              </TabPanel>
              <TabPanel>
                <PregnancySafety drugName={drug.name} />
              </TabPanel>
              <TabPanel>
                <DrugInteractions primaryDrug={drug.name} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      ))}
    </VStack>
  );
};

export default DrugSearchResults;