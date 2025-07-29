import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Badge,
  Flex,
  Button,
  useToast,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCopy } from 'react-icons/fa';
import axios from 'axios';

const ICD10Results = ({ drugName }) => {
  const [icdCodes, setIcdCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (!drugName) return;

    const fetchIcdCodes = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/icd10-data.json');
        const drugLower = drugName.toLowerCase();
        const codes = response.data[drugLower] || [];
        setIcdCodes(codes);
      } catch (error) {
        console.error('Error fetching ICD-10 codes:', error);
        setIcdCodes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIcdCodes();
  }, [drugName]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(
      () => {
        toast({
          title: 'Copied!',
          description: `ICD-10 code ${code} copied to clipboard`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      },
      (err) => {
        console.error('Failed to copy: ', err);
        toast({
          title: 'Failed to copy',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    );
  };

  if (loading) {
    return (
      <Box textAlign="center" p={5}>
        <Spinner size="lg" color="brand.500" />
        <Text mt={2}>Loading ICD-10 codes...</Text>
      </Box>
    );
  }

  if (!drugName || icdCodes.length === 0) {
    return null;
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4} bg={bgColor} borderColor={borderColor}>
      <Heading size="md" mb={4}>
        Recommended ICD-10 Codes
      </Heading>
      <VStack spacing={3} align="stretch">
        {icdCodes.map((item, index) => (
          <Flex
            key={index}
            justify="space-between"
            align="center"
            p={3}
            borderWidth="1px"
            borderRadius="md"
            borderColor={borderColor}
          >
            <Box>
              <Badge colorScheme="brand" mb={1}>
                {item.code}
              </Badge>
              <Text>{item.description}</Text>
            </Box>
            <Button
              size="sm"
              leftIcon={<FaCopy />}
              onClick={() => copyToClipboard(item.code)}
              variant="outline"
            >
              Copy
            </Button>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default ICD10Results;