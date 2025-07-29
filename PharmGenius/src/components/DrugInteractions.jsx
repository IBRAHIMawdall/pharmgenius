import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';

const DrugInteractions = ({ primaryDrug }) => {
  const [secondDrug, setSecondDrug] = useState('');
  const [interaction, setInteraction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bgColor = useColorModeValue('white', 'gray.700');

  const checkInteraction = async (e) => {
    e.preventDefault();
    if (!primaryDrug || !secondDrug) return;

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `/api/drug-interactions?drug1=${encodeURIComponent(primaryDrug)}&drug2=${encodeURIComponent(
          secondDrug
        )}`
      );
      
      if (response.data.interaction) {
        setInteraction(response.data.interaction);
      } else {
        setInteraction(null);
        setError(response.data.message || 'No interaction data found');
      }
    } catch (error) {
      console.error('Error checking drug interaction:', error);
      setError('Failed to check drug interaction');
      setInteraction(null);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'severe':
        return 'red';
      case 'moderate':
        return 'orange';
      case 'mild':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} bg={bgColor}>
      <Heading size="md" mb={4}>
        Drug Interaction Checker
      </Heading>

      <form onSubmit={checkInteraction}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Primary Drug</FormLabel>
            <Input value={primaryDrug} isReadOnly bg="gray.100" />
          </FormControl>

          <FormControl>
            <FormLabel>Second Drug</FormLabel>
            <Input
              placeholder="Enter second drug name"
              value={secondDrug}
              onChange={(e) => setSecondDrug(e.target.value)}
              isRequired
            />
          </FormControl>

          <Button type="submit" colorScheme="brand" isLoading={loading}>
            Check Interaction
          </Button>
        </VStack>
      </form>

      {loading && (
        <Box textAlign="center" mt={4}>
          <Spinner />
          <Text mt={2}>Checking interaction...</Text>
        </Box>
      )}

      {error && !loading && (
        <Alert status="info" mt={4} borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {interaction && !loading && (
        <Alert
          status={
            interaction.severity === 'severe'
              ? 'error'
              : interaction.severity === 'moderate'
              ? 'warning'
              : 'info'
          }
          variant="subtle"
          flexDirection="column"
          alignItems="flex-start"
          mt={4}
          borderRadius="md"
        >
          <AlertIcon />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {interaction.severity.charAt(0).toUpperCase() + interaction.severity.slice(1)} Interaction
          </AlertTitle>
          <AlertDescription>{interaction.description}</AlertDescription>
        </Alert>
      )}
    </Box>
  );
};

export default DrugInteractions;