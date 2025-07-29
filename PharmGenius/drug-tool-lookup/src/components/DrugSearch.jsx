import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Stack,
  SimpleGrid,
  Select,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Badge,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { searchDrugs, getCategories } from '../services/drugService'

// Helper function to parse query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function DrugSearch() {
  const query = useQuery()
  const navigate = useNavigate()
  const initialQuery = query.get('query') || ''
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesList = await getCategories()
        setCategories(categoriesList)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }
    
    fetchCategories()
  }, [])
  
  // Perform search if query parameter exists
  useEffect(() => {
    if (initialQuery) {
      handleSearch()
    }
  }, [initialQuery])
  
  const handleSearch = async (e) => {
    if (e) e.preventDefault()
    
    if (!searchQuery.trim()) return
    
    setLoading(true)
    setError(null)
    setSearched(true)
    
    try {
      const results = await searchDrugs(searchQuery, selectedCategory)
      setSearchResults(results.results || [])
      
      // Update URL with search parameters
      const params = new URLSearchParams()
      params.set('query', searchQuery)
      if (selectedCategory) params.set('category', selectedCategory)
      navigate(`/search?${params.toString()}`)
    } catch (err) {
      setError('Failed to search drugs. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleDrugClick = (drugId) => {
    navigate(`/drug/${drugId}`)
  }

  return (
    <Container maxW="6xl">
      <Heading as="h1" size="xl" mb={6}>
        Drug Search
      </Heading>
      
      <Box as="form" onSubmit={handleSearch} mb={8}>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
          <InputGroup size="md">
            <Input
              placeholder="Search for medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="white"
              borderColor="gray.300"
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
          
          <Select
            placeholder="All Categories"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            bg="white"
            borderColor="gray.300"
            maxW={{ base: '100%', md: '200px' }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          
          <Button
            colorScheme="brand"
            onClick={handleSearch}
            minW={{ base: '100%', md: '120px' }}
          >
            Search
          </Button>
        </Stack>
      </Box>
      
      {loading && (
        <Flex justify="center" my={10}>
          <Spinner size="xl" color="brand.500" />
        </Flex>
      )}
      
      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      
      {!loading && searched && searchResults.length === 0 && (
        <Alert status="info" mb={6}>
          <AlertIcon />
          No drugs found matching your search criteria.
        </Alert>
      )}
      
      {!loading && searchResults.length > 0 && (
        <>
          <Text mb={4}>
            Found {searchResults.length} results for "{searchQuery}"
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {searchResults.map((drug) => (
              <Card
                key={drug.id}
                cursor="pointer"
                onClick={() => handleDrugClick(drug.id)}
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: 'lg',
                  transition: 'all 0.3s ease',
                }}
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow="md"
                borderRadius="lg"
                overflow="hidden"
              >
                <CardBody>
                  <Heading size="md" mb={2}>
                    {drug.drug_name}
                  </Heading>
                  
                  <Text color="gray.500" fontSize="sm" mb={3}>
                    {drug.generic_name}
                  </Text>
                  
                  <Flex wrap="wrap" gap={2} mb={3}>
                    <Badge colorScheme="blue">{drug.category}</Badge>
                    {drug.dosage_form && (
                      <Badge colorScheme="purple">{drug.dosage_form}</Badge>
                    )}
                    {drug.strength && (
                      <Badge colorScheme="green">{drug.strength}</Badge>
                    )}
                  </Flex>
                  
                  <Text fontSize="sm" noOfLines={2}>
                    {drug.indications || 'No indications available'}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </>
      )}
    </Container>
  )
}