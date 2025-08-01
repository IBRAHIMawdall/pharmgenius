import {
  Box,
  Container,
  Stack,
  Text,
  Link,
    HStack,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react'
import { FaLinkedinIn, FaPhone, FaEnvelope, FaInfoCircle, FaGithub } from 'react-icons/fa'

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt="auto"
      py={6}
    >
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text>© 2025 PharmGenius. All rights reserved</Text>

        <HStack spacing={4}>
          <IconButton
            as={Link}
            href="http://linkedin.com/in/ibrahim-salama-6b0b5812a"
            target="_blank"
            rel="noopener"
              aria-label="LinkedIn"
            icon={<FaLinkedinIn />}
            size="sm"
            colorScheme="linkedin"
            variant="ghost"
            _hover={{ bg: 'linkedin.500', color: 'white' }}
          />

          <IconButton
            as={Link}
            href="tel:+971585004660"
              aria-label="Phone"
            icon={<FaPhone />}
            size="sm"
            colorScheme="green"
            variant="ghost"
            _hover={{ bg: 'green.500', color: 'white' }}
          />

          <IconButton
            as={Link}
            href="mailto:ibrahiemawdallah@gmail.com"
              aria-label="Email"
            icon={<FaEnvelope />}
            size="sm"
            colorScheme="blue"
            variant="ghost"
            _hover={{ bg: 'blue.500', color: 'white' }}
          />

          <IconButton
            as={Link}
            href="#"
            aria-label="Info"
            icon={<FaInfoCircle />}
            size="sm"
            colorScheme="gray"
            variant="ghost"
            _hover={{ bg: 'gray.500', color: 'white' }}
          />

          <IconButton
            as={Link}
            href="https://github.com/IBRAHIMawdall"
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
            icon={<FaGithub />}
            size="sm"
            colorScheme="gray"
            variant="ghost"
            _hover={{ bg: 'gray.800', color: 'white' }}
          />
        </HStack>
        </Container>
    </Box>
  )
}
