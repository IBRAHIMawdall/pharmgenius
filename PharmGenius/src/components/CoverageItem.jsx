import { Flex, Text, Badge, Icon } from '@chakra-ui/react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const CoverageItem = ({ plan, isCovered }) => {
  return (
    <Flex align="center" justify="space-between">
      <Text fontWeight="medium">{plan}</Text>
      {isCovered ? (
        <Badge colorScheme="green" p={2} borderRadius="full" display="flex" alignItems="center">
          <Icon as={FaCheckCircle} mr={2} />
          Covered
        </Badge>
      ) : (
        <Badge colorScheme="red" p={2} borderRadius="full" display="flex" alignItems="center">
          <Icon as={FaTimesCircle} mr={2} />
          Not Covered
        </Badge>
      )}
    </Flex>
  );
};

export default CoverageItem;