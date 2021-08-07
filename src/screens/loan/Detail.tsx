import React, { FC, useContext, useState } from 'react';
import { HStack, Image, ScrollView, Stack, Text, VStack, Icon, Button } from 'native-base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import LoanContext from '@components/LoanContext';
import { LoanNavigationProps } from '.';
import { genUrlStorage } from '@support/functions';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { getLoanStatusLabel, getStatusColor } from '@actions/loan';
import { RefreshControl, ToastAndroid } from 'react-native';
import { LoanResponse } from '@http/Response';
import ErrorException from '@http/exception/ErrorException';

const Detail: FC = () => {
  const context = useContext(LoanContext);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<LoanNavigationProps, 'Detail'>>();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(route.params.data);
  const book = data.books.length > 0 ? data.books[0] : undefined;

  const genLate = () => {
    if (data.status <= 0) return 0;
    const late = moment().diff(moment(data.return), 'days');
    return late > 0 ? late : 0
  }

  const onRefresh = () => {
    setRefreshing(true);
    context.refreshSingle(data.id)
    .then(res => {
      if (res instanceof LoanResponse && res.data) {
        setData(res.data);
      }
    })
    .finally(() => {
      setRefreshing(false);
    })
  }

  const onAbort = () => {
    setLoading(true);
    context.abort(data.id)
    .then(res => {
      if (res instanceof LoanResponse) {
        ToastAndroid.show('Berhasil Batalkan Peminjaman', ToastAndroid.LONG);
        if (res.data) setData(res.data);
      } else if (res instanceof ErrorException && res.message) {
        ToastAndroid.show(res.message, ToastAndroid.LONG);
      }
    })
    .finally(() => {
      setLoading(false);
    })
  }

  return (
    <ScrollView backgroundColor='white' refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }>
      <Stack flex={1} padding={5}>
        <HStack space={2} marginBottom={5}>
          <VStack>
            <Image
              source={{ uri: genUrlStorage(book?.thumbnail ?? '') }}
              fallbackSource={require('@images/book_placeholder.png')}
              height={150}
              width={120}
              alt='Cover Buku' />
          </VStack>
          <VStack flex={1}>
            <Text fontSize='2xl' marginBottom={2} bold>{ book?.name }</Text>  
            <HStack justifyContent='flex-start' space={1} borderRadius={5} alignItems='flex-start' marginBottom={1}>
              <Icon as={<IconMaterial name='tag' />} color='blue.500' size={4} />
              <Text flex={1} fontSize='sm' color='gray.500'>{ book?.category.name }</Text>
            </HStack>
            <HStack justifyContent='flex-start' space={1} borderRadius={5} alignItems='flex-start' marginBottom={1}>
              <Icon as={<IconMaterial name='account-box' />} color='blue.500' size={4} />
              <Text flex={1} fontSize='sm' color='gray.500'>{ book?.writer }</Text>
            </HStack>
          </VStack>
        </HStack>
        <VStack space={3} marginBottom={5}>
          <HStack>
            <VStack flex={1}>
              <Text bold>Jumlah</Text>
              <Text fontSize='sm'>{ book?.pivot.qty } buah</Text>
            </VStack>
            <VStack flex={1}>
              <Text bold>Tanggal Pinjam</Text>
              <Text fontSize='sm'>{ moment(data.created_at).format('DD MMMM YYYY') }</Text>
            </VStack>
          </HStack>
          <HStack>
            <VStack flex={1}>
              <Text bold>Status</Text>
              <HStack alignItems='center' space={1}>
                <Stack size='2' backgroundColor={getStatusColor(data.status)} borderRadius={5} />
                <Text fontSize='sm'>{ getLoanStatusLabel(data.status) }</Text>
              </HStack>
            </VStack>
            <VStack flex={1}>
              <Text bold>Tanggal Kembali</Text>
              <Text fontSize='sm'>{ moment(data.return).format('DD MMMM YYYY') }</Text>
            </VStack>
          </HStack>
          <HStack>
            <VStack flex={1}>
              <Text bold>Telat</Text>
              <Text fontSize='sm'>{ genLate() } hari</Text>
            </VStack>
          </HStack>
        </VStack>
        {data.status == 2 && <Button
          isLoading={loading}
          isLoadingText='Batal'
          onPress={onAbort}
          backgroundColor='red.500'
          size='sm'
          _pressed={{ backgroundColor: 'red.400' }}>
          <HStack alignItems='center' space={1}>
            <Icon as={<IconMaterial name='close' />} color='white' size={5} />
            <Text color='white'>Batal</Text>
          </HStack>
        </Button>}
      </Stack>
    </ScrollView>
  )
}

export default Detail;