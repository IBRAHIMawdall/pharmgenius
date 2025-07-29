import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  createIcon,
  Flex,
  SimpleGrid,
  Image,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}
          >
            UAE Healthcare <br />
            <Text as={'span'} color={'brand.500'}>
              Drug Tool Lookup
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            Comprehensive drug information with Daman insurance coverage for UAE healthcare professionals.
            Search for medications, check insurance coverage, and access clinical information all in one place.
          </Text>
          <form onSubmit={handleSearch} style={{ width: '100%' }}>
            <Stack
              direction={'column'}
              spacing={3}
              align={'center'}
              alignSelf={'center'}
              position={'relative'}
              width={'100%'}
            >
              <InputGroup size="lg" maxW="600px" width="100%">
                <Input
                  placeholder="Search for a medication..."
                  bg={'white'}
                  border={1}
                  borderColor={'gray.300'}
                  _hover={{
                    borderColor: 'brand.500',
                  }}
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 1px #0088e6',
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleSearch}
                    colorScheme="brand"
                  >
                    <SearchIcon />
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Button
                colorScheme={'brand'}
                bg={'brand.500'}
                rounded={'full'}
                px={6}
                _hover={{
                  bg: 'brand.600',
                }}
                type="submit"
              >
                Search Medications
              </Button>
              <Box>
                <Icon
                  as={Arrow}
                  color={useColorModeValue('gray.800', 'gray.300')}
                  w={71}
                  position={'absolute'}
                  right={-71}
                  top={'10px'}
                />
                <Text
                  fontSize={'lg'}
                  fontFamily={'Caveat'}
                  position={'absolute'}
                  right={'-125px'}
                  top={'-15px'}
                  transform={'rotate(10deg)'}
                >
                  Start here
                </Text>
              </Box>
            </Stack>
          </form>
        </Stack>
      </Container>

      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={12}>
        <Container maxW={'6xl'}>
          <Heading
            textAlign={'center'}
            fontSize={'3xl'}
            py={10}
            fontWeight={'bold'}
          >
            Key Features
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature
              icon={<Icon as={FeatureIcon} w={10} h={10} />}
              title={'Daman Insurance Coverage'}
              text={'Check medication coverage for Thiqa, Basic, and Enhanced plans instantly.'}
            />
            <Feature
              icon={<Icon as={FeatureIcon} w={10} h={10} />}
              title={'Comprehensive Drug Database'}
              text={'Access detailed information on thousands of medications available in the UAE.'}
            />
            <Feature
              icon={<Icon as={FeatureIcon} w={10} h={10} />}
              title={'ICD-10 Integration'}
              text={'Find medications linked to specific diagnoses using ICD-10 codes.'}
            />
          </SimpleGrid>
        </Container>
      </Box>
    </>
  )
}

const Feature = ({ title, text, icon }) => {
  return (
    <Stack align={'center'} textAlign={'center'}>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'brand.500'}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  )
}

const Arrow = createIcon({
  displayName: 'Arrow',
  viewBox: '0 0 72 24',
  path: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.600904 7.08166C0.764293 6.8879 1.01492 6.79004 1.26654 6.82177C2.83216 7.01918 5.20326 7.24581 7.54543 7.23964C9.92491 7.23338 12.1351 6.98464 13.4704 6.32142C13.84 6.13785 14.2885 6.28805 14.4722 6.65692C14.6559 7.02578 14.5052 7.47362 14.1356 7.6572C12.4625 8.48822 9.94063 8.72541 7.54852 8.7317C5.67514 8.73663 3.79547 8.5985 2.29921 8.44247C2.80955 9.59638 3.50943 10.6396 4.24665 11.7384C4.39435 11.9585 4.54354 12.1809 4.69301 12.4068C5.79543 14.0733 6.88128 15.8995 7.1179 18.2636C7.15893 18.6735 6.85928 19.0393 6.4486 19.0805C6.03792 19.1217 5.67174 18.8227 5.6307 18.4128C5.43271 16.4346 4.52957 14.868 3.4457 13.2296C3.3058 13.0181 3.16221 12.8046 3.01684 12.5885C2.05899 11.1646 1.02372 9.62564 0.457909 7.78069C0.383671 7.53862 0.437515 7.27541 0.600904 7.08166ZM5.52039 10.2248C5.77662 9.90161 6.24663 9.84687 6.57018 10.1025C16.4834 17.9344 29.9158 22.4064 42.0781 21.4773C54.1988 20.5514 65.0339 14.2748 69.9746 0.584299C70.1145 0.196597 70.5427 -0.0046455 70.931 0.134813C71.3193 0.274276 71.5206 0.70162 71.3807 1.08932C66.2105 15.4159 54.8056 22.0014 42.1913 22.965C29.6185 23.9254 15.8207 19.3142 5.64226 11.2727C5.31871 11.0171 5.26415 10.5479 5.52039 10.2248Z"
      fill="currentColor"
    />
  ),
})

const FeatureIcon = createIcon({
  displayName: 'FeatureIcon',
  viewBox: '0 0 24 24',
  path: (
    <path
      fill="currentColor"
      d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v6h2v-6h-2zm0-4v2h2V7h-2z"
    />
  ),
})