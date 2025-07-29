import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';

const PregnancySafety = ({ drugName }) => {
  const [pregnancyData, setPregnancyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.700');

  useEffect(() => {
    if (!drugName) return;

    const fetchPregnancyData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/pregnancy-categories?drug=${encodeURIComponent(drugName)}`);
        setPregnancyData(response.data.result || null);
      } catch (error) {
        console.error('Error fetching pregnancy data:', error);
        setPregnancyData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPregnancyData();
  }, [drugName]);

  const getCategoryColor = (category) => {
    const firstChar = category.charAt(0);
    switch (firstChar) {
      case 'A':
        return 'green';
      case 'B':
        return 'teal';
      case 'C':
        return 'yellow';
      case 'D':
        return 'orange';
      case 'X':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" p={5}>
        <Spinner size="md" color="brand.500" />
        <Text mt={2}>Loading pregnancy safety data...</Text>
      </Box>
    );
  }

  if (!drugName || !pregnancyData) {
    return null;
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} bg={bgColor}>
      <Heading size="md" mb={4}>
        Pregnancy Safety
      </Heading>

      <VStack spacing={3} align="stretch">
        <Box>
          <Text fontWeight="bold" mb={1}>
            FDA Pregnancy Category:
          </Text>
          <Badge
            colorScheme={getCategoryColor(pregnancyData.category)}
            fontSize="lg"
            px={3}
            py={1}
            borderRadius="full"
          >
            Category {pregnancyData.category}
          </Badge>
        </Box>

        <Box>
          <Text fontWeight="bold" mb={1}>
            Category Description:
          </Text>
          <Text>{pregnancyData.categoryDescription}</Text>
        </Box>

        <Box>
          <Text fontWeight="bold" mb={1}>
            Recommendation:
          </Text>
          <Alert status={pregnancyData.category === 'X' ? 'error' : 'info'} borderRadius="md">
            <AlertIcon />
            {pregnancyData.recommendation}
          </Alert>
        </Box>
      </VStack>
    </Box>
  );
};

export default PregnancySafety;