import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f5ff',
      100: '#b3e0ff',
      200: '#80ccff',
      300: '#4db8ff',
      400: '#1aa3ff',
      500: '#0088e6',
      600: '#006bb3',
      700: '#004d80',
      800: '#00334d',
      900: '#001a26',
    },
    daman: {
      thiqa: '#2c7a7b',
      basic: '#3182ce',
      enhanced: '#6b46c1',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          boxShadow: 'md',
        },
      },
    },
  },
})

export default theme