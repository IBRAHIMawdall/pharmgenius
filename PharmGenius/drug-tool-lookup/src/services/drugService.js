import api from './api'

/**
 * Search for drugs by name, generic name, or category
 * @param {string} query - Search query
 * @param {string} category - Optional category filter
 * @param {number} limit - Maximum number of results to return
 * @returns {Promise<Object>} - Search results
 */
export const searchDrugs = async (query, category = '', limit = 20) => {
  try {
    const params = { query, limit }
    if (category) params.category = category
    
    const response = await api.get('/drug-service/search', { params })
    return response.data
  } catch (error) {
    console.error('Error searching drugs:', error)
    throw error
  }
}

/**
 * Get drug details by ID
 * @param {number} id - Drug ID
 * @returns {Promise<Object>} - Drug details
 */
export const getDrugDetails = async (id) => {
  try {
    const response = await api.get(`/drug-service/drugs/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching drug details:', error)
    throw error
  }
}

/**
 * Get all drug categories
 * @returns {Promise<Array>} - List of categories
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/drug-service/categories')
    return response.data.categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

/**
 * Check Daman insurance coverage for a drug
 * @param {string} drugName - Name of the drug
 * @returns {Promise<Object>} - Coverage information
 */
export const checkDamanCoverage = async (drugName) => {
  try {
    const response = await api.get('/daman-service/coverage', {
      params: { drug: drugName }
    })
    return response.data
  } catch (error) {
    console.error('Error checking Daman coverage:', error)
    throw error
  }
}

export default {
  searchDrugs,
  getDrugDetails,
  getCategories,
  checkDamanCoverage
}