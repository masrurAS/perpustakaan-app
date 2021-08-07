import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { StatusBar, FlatList, ScrollView, Text, VStack, View, Button, Icon, Stack } from 'native-base';
import { ListRenderItem, RefreshControl } from 'react-native';
import { LoanCard } from '@components';
import LoanContext from '@components/LoanContext';
import { Loan } from '@store/_entity';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const statuses: Record<string, { key: number, label: string }> = {
  all: {
    key: 9,
    label: 'Semua'
  },
  belum_diambil: {
    key: 2,
    label: 'Belum diambil'
  },
  belum_dikembalikan: {
    key: 1,
    label: 'Belum dikembalikan'
  },
  sudah_dikembalikan: {
    key: 0,
    label: 'Sudah dikembalikan'
  },
  batal: {
    key: -1,
    label: 'Batal'
  },
}

const ListLoan: FC = () => {
  const navigation = useNavigation();
  const context = useContext(LoanContext);
  const [status_filter, setStatusFilter] = useState('all');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const renderItem: ListRenderItem<Loan> = (item) => (
    <LoanCard data={item.item} onPress={() => navigation.navigate('Detail', { data: item.item })} />
  )
  const renderStatus = (key: string, active: boolean = false) => (
    <Button
      paddingBottom={2}
      onPress={() => setStatusFilter(key)}
      size='xs'
      key={statuses[key].key}
      borderColor='gray.700'
      borderRadius={0}
      borderTopRadius={5}
      backgroundColor={active ? 'white' : 'transparent'}>
      <Text height={6} color='gray.700'>{ statuses[key].label }</Text>
    </Button>
  )
  
  const filtered = () => {
    const { key } = statuses[status_filter];
    if (key == 9) {
      return context.datas;
    }

    return context.datas.filter(d => d.status === key)
  }

  const ordered = (data: Loan[]) => {
    return data.sort((a, b) => 0)
  }

  const onRefresh = () => {
    setRefreshing(true);
    context.get_from_server()
    .finally(() => {
      setRefreshing(false);
    })
  }

  const warning = useMemo(() => ({
    2: loans.filter(d => d.status === 2).length > 0
  }), [loans]);

  useEffect(() => {
    setLoans(ordered(filtered()));
  }, [status_filter, context.datas])

  return (
    <View backgroundColor='white' flex={1}>
      <StatusBar backgroundColor='#3b82f6' barStyle='light-content' />
      <VStack>
        <ScrollView
          borderBottomWidth={0}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          _contentContainerStyle={{ paddingTop: 2, marginBottom: 2, paddingX: 5, alignItems: 'flex-start', backgroundColor: 'blue.100' }}>
          {Object.keys(statuses).map(key => renderStatus(key, key == status_filter))}
        </ScrollView>
        {warning[2] && <Stack padding={2} marginBottom={2} backgroundColor='orange.200' marginX={2} borderRadius={5}>
          <Text fontSize='sm' color='gray.700'>Peminjaman akan dibatalkan jika buku tidak diambil setelah satu hari pasca peminjaman dilakukan.</Text>
        </Stack>}
        { loans.length > 0 && <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          data={loans}
          renderItem={renderItem}
          keyExtractor={(item: Loan) => `${item.id}`} />}
      </VStack>
      {loans.length <= 0 && <Stack flex={1} alignItems='center' justifyContent='center'>
          <Icon as={<IconMaterial name='file-document' />} size={20} color='gray.300' marginBottom={5} />
          <Text color='gray.300'>Tidak ada Peminjaman</Text>
        </Stack>}
    </View>
  )
}

export default ListLoan;