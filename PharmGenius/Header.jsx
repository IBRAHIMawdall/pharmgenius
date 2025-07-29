import { Box, Flex, Heading, IconButton, useColorMode, Spacer, HStack, Icon } from '@chakra-ui/react';
import { FaSun, FaMoon, FaPills } from 'react-icons/fa';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      as="header"
      bgGradient="linear(to-r, brand.500, brand.700)"
      color="white"
      px={4}
      py={4}
      shadow="md"
    >
      <Flex align="center" maxW="container.md" mx="auto">
        <HStack spacing={2}>
          <Icon as={FaPills} w={6} h={6} />
          <Heading as="h1" size="lg" letterSpacing={'tighter'} fontWeight="bold">
            PharmGenius
          </Heading>
        </HStack>
        <Spacer />
        <IconButton
          onClick={toggleColorMode}
          icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
          isRound={true}
          variant="ghost"
          _hover={{ bg: 'whiteAlpha.300' }}
          aria-label="Toggle Theme"
        />
      </Flex>
    </Box>
  );
};

export default Header;