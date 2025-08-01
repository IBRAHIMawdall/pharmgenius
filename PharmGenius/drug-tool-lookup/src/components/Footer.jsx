import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
} from '@chakra-ui/react'

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt="auto"
      py={4}
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
        <Text>© 2025 Drug Tool Lookup. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
          <Link href={'#'}>Privacy</Link>
          <Link href={'#'}>Terms</Link>
          <Link href={'#'}>Contact</Link>
        </Stack>
      </Container>
    </Box>
  )
}