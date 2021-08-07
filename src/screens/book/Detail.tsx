import React, { FC, useContext, useState } from 'react';
import { Box, ScrollView, Image, Heading, Text, HStack, VStack, Icon, Button } from 'native-base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BookNavigationProps } from '.';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import LoanContext from '@components/LoanContext';
import ErrorException from '@http/exception/ErrorException';
import { RefreshControl, ToastAndroid } from 'react-native';
import { BookResponse, LoanResponse } from '@http/Response';
import { genUrlStorage } from '@support/functions';
import { useDispatch } from 'react-redux';
import { getBook } from '@actions/book';
import { MUTATIONS } from '@store/reducers/book';

const Detail: FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const context = useContext(LoanContext);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const route = useRoute<RouteProp<BookNavigationProps, 'Detail'>>();
  const { data } = route.params;

  const doLoan = () => {
    if (data.stock <= 0) {
      ToastAndroid.show("Stok Habis", ToastAndroid.LONG);
      return;
    }

    setLoading(true)
    context.create(data.id)
    .then(res => {
      if (res instanceof LoanResponse) {
        ToastAndroid.show('Berhasil Pinjam Buku', ToastAndroid.LONG);
        if (navigation.canGoBack()) navigation.goBack();
        navigation.navigate('Loan');
      } else if (res instanceof ErrorException && res.message) {
        ToastAndroid.show(res.message, ToastAndroid.LONG);
      }
    })
    .finally(() => {
      setLoading(false);
    })
  }

  const onRefresh = () => {
    setRefreshing(true);
    getBook(data.id)
    .then(res => {
      if (res instanceof BookResponse && res.data) {
        dispatch(MUTATIONS.SET_BOOK(data.id, res.data));
      }
    })
    .finally(() => {
      setRefreshing(false);
    })
  }

  return (
    <ScrollView refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }>
      <Box flex={1}>
        <Image height={300} source={{ uri: genUrlStorage(data.thumbnail) }} fallbackSource={require('@images/book_placeholder.png')} alt={'img'} />
        <Box padding={3}>
          <VStack flex={1} marginBottom={5}>
            <Heading>{ data.name }</Heading>
            <VStack space={1}>
              <HStack space={1} borderRadius={5} alignItems='center'>
                <Icon as={<IconMaterial name='tag' />} color='blue.500' size={5} />
                <Text color='gray.500' bold>{ data.category.name }</Text>
              </HStack>
              <HStack space={1} borderRadius={5} alignItems='center'>
                <Icon as={<IconMaterial name='account-box' />} color='blue.500' size={5} />
                <Text color='gray.500' bold>{ data.writer }</Text>
              </HStack>
              <HStack space={1} borderRadius={5} alignItems='center'>
                <Icon as={<IconMaterial name='book' />} color='blue.500' size={5} />
                <Text color='gray.500' bold>{ data.stock } buah</Text>
              </HStack>
            </VStack>
          </VStack>

          <Text marginBottom={5} color='gray.500'>{ data.description || '-' }</Text>

          <Button
            onPress={doLoan}
            isLoading={loading}
            isLoadingText='Pinjam'
            size='sm'
            padding={2}
            backgroundColor='blue.500'
            _pressed={{ backgroundColor: 'blue.400' }}>
            <HStack space={1}>
              <Icon as={<IconMaterial name='archive-arrow-down' />} color='white' size={5} alignSelf='flex-end' />
              <Text color='white'>Pinjam</Text>
            </HStack>
          </Button>
        </Box>
      </Box>
    </ScrollView>
  )
}

export default Detail;