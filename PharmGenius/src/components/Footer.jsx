import { Box, Text, useColorModeValue, Flex, Link, Icon, HStack } from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaPhone, FaEnvelope, FaInfoCircle } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box
      as="footer"
      py={6}
      textAlign="center"
      bg={useColorModeValue('gray.100', 'gray.900')}
      color={useColorModeValue('gray.600', 'gray.400')}
    >
      <Flex direction="column" align="center" maxW="container.md" mx="auto">
        <HStack spacing={4} mb={4}>
          <Link href="http://linkedin.com/in/ibrahim-salama-6b0b5812a" isExternal>
            <Icon as={FaLinkedin} w={6} h={6} _hover={{ color: 'blue.500' }} />
          </Link>
          <Link href="tel:+971585004660">
            <Icon as={FaPhone} w={6} h={6} _hover={{ color: 'green.500' }} />
          </Link>
          <Link href="mailto:ibrahiemawdallah@gmail.com">
            <Icon as={FaEnvelope} w={6} h={6} _hover={{ color: 'red.500' }} />
          </Link>
          <Icon as={FaInfoCircle} w={6} h={6} _hover={{ color: 'blue.400' }} cursor="pointer" />
          <Link href="https://github.com/IBRAHIMawdall" isExternal>
            <Icon as={FaGithub} w={6} h={6} _hover={{ color: 'gray.800' }} />
          </Link>
        </HStack>
        <Text>&copy; {new Date().getFullYear()} PharmGenius. All Rights Reserved.</Text>
      </Flex>
    </Box>
  );
};

export default Footer;