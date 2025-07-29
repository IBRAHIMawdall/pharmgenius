import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Heading,
  Text,
  Button,
  Container,
  useColorModeValue,
} from '@chakra-ui/react'

export default function NotFound() {
  return (
    <Container maxW="lg" py={20} textAlign="center">
      <Heading
        display="inline-block"
        as="h1"
        size="4xl"
        bgGradient="linear(to-r, brand.400, brand.600)"
        backgroundClip="text"
        mb={4}
      >
        404
      </Heading>
      <Text fontSize="xl" mb={8}>
        Page Not Found
      </Text>
      <Text color={'gray.500'} mb={8}>
        The page you're looking for doesn't seem to exist.
      </Text>

      <Button
        as={RouterLink}
        to="/"
        colorScheme="brand"
        bgGradient="linear(to-r, brand.400, brand.500, brand.600)"
        color="white"
        variant="solid"
        size="lg"
      >
        Go to Home
      </Button>
    </Container>
  )
}