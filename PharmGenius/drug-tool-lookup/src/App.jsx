import { Routes, Route } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './components/HomePage'
import DrugSearch from './components/DrugSearch'
import DrugDetails from './components/DrugDetails'
import NotFound from './components/NotFound'

function App() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box flex="1" as="main" py={8} px={4}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<DrugSearch />} />
          <Route path="/drug/:id" element={<DrugDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  )
}

export default App