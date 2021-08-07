import React, { FC } from 'react';
import { Pressable, HStack, VStack, Image, Text, Box } from 'native-base';
import { Loan } from '@store/_entity';
import { getLoanStatusLabel, getStatusColor } from '@actions/loan';
import moment from 'moment';
import { formatWithNow, genUrlStorage } from '@support/functions';
import { GestureResponderEvent } from 'react-native';

const placeholder = require('@images/book_placeholder.png');

export interface LoanCardProps {
  data: Loan,
  onPress: (e: GestureResponderEvent) => void
}
const LoanCard: FC<LoanCardProps> = ({ data, onPress }) => {
  const book = data.books.length > 0 ? data.books[0] : undefined;

  return (
    <Pressable onPress={onPress} _pressed={{ backgroundColor: 'gray.200' }}>
      <HStack space={2} padding={3} alignItems='center'>
        <Image
          width={60}
          height={60}
          borderRadius={100}
          source={{ uri: genUrlStorage(book?.thumbnail || '') }}
          defaultSource={placeholder}
          fallbackSource={placeholder}
          alt='book_image' />
        <VStack flex={1}>
          <Text fontSize='lg' bold>{ book?.name }</Text>
          <HStack alignItems='center' space={1}>
            <Box size='2' backgroundColor={getStatusColor(data.status)} borderRadius={5} />
            <Text fontSize='sm'>{ getLoanStatusLabel(data.status) }</Text>
          </HStack>
        </VStack>
        <Text color='grey' fontSize='sm'>{ formatWithNow(moment(data.created_at)) }</Text>
      </HStack>
    </Pressable>
  )
}

export default LoanCard;