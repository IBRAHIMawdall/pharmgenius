import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
        fontFamily: "'Inter', sans-serif",
      },
    }),
  },
  colors: {
    brand: {
      50: '#f0e7ff',
      100: '#d0bfff',
      200: '#b197fc',
      300: '#916ffa',
      400: '#7147f7',
      500: '#5a2fdd', // Primary brand color
      600: '#4424b0',
      700: '#301983',
      800: '#1d0f56',
      900: '#0b052a',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
    },
  },
});

export default theme;