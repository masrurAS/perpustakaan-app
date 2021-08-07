import React, { FC } from 'react';
import { Box, Image, Text, HStack, VStack, Pressable, Icon } from 'native-base';
import { Book } from '@store/_entity';
import { GestureResponderEvent } from 'react-native';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import { genUrlStorage } from '@support/functions';

export interface BookCardProps {
  data: Book
  onPress?: ((event: GestureResponderEvent) => void)|null
}
const BookCard: FC<BookCardProps> = ({ data, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <Box width='100%' height={250}>
        <Image borderRadius={10} width='100%' height={250} resizeMode='cover' source={{ uri: genUrlStorage(data.thumbnail) }} fallbackSource={require('@images/book_placeholder.png')} alt={'img'} position='absolute' />
        <Box backgroundColor='rgba(0,0,0,0.5)' flex={1} paddingX={2} paddingY={5} paddingBottom={5} justifyContent='space-between' borderRadius={10}>
          <VStack>
            <Text fontSize='2xl' color='white' bold>{ data.name }</Text>
            <Text fontSize='md' color='white' fontWeight='600'>- { data.category.name }</Text>
          </VStack>
          <HStack justifyContent='flex-end'>
            <HStack backgroundColor='blue.500' padding={1.5} borderRadius={8} space={1} alignItems='center'>
              <Text fontSize='sm' color='white'>{ data.stock }</Text>
              <Icon as={<IconMaterial name='book' />} color='white' size={5} />
            </HStack>
          </HStack>
        </Box>
      </Box>
    </Pressable>
  )
}

export default BookCard;