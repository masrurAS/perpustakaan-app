import React, { FC, useContext, useEffect, useState } from 'react';
import { Stack, Box, VStack, Heading, Select, StatusBar, Input, Text, HStack, Button, Icon, IconButton } from 'native-base';
import { FlatGrid } from 'react-native-super-grid';
import { ListRenderItem } from 'react-native';
import { BookCard } from '@components';
import { Book } from '@store/_entity';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '@store';
import { ACTIONS } from '@store/reducers/book';
import Loader from '@components/Loader';
import AppContext from '@components/AppContext';
import { callname } from '@support/functions';

const Discovery: FC = () => {
  const context = useContext(AppContext);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const categories = useSelector((state: State) => state.category.datas);
  const book = useSelector((state: State) => state.book);
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading_more, setLoadingMore] = useState(false);
  const [current_page, setCurrentPage] = useState(1);
  const [can_load_more, setCanLoadMore] = useState(true);
  const renderItem: ListRenderItem<Book> = ({ item }) => {
    return (
      <BookCard data={item} onPress={() => navigation.navigate('Detail', { data: item })} />
    )
  }

  const loadMore = () => {
    setLoadingMore(true);
    dispatch(ACTIONS.LOAD_MORE({
      category: category == '' ? undefined : category,
      keyword: keyword == '' ? undefined : keyword
    }, current_page+1, (datas: any[]) => {
      setCurrentPage(current_page+1);
      setLoadingMore(false);
      setCanLoadMore(datas.length > 0);
    }));
  }

  useEffect(() => {
    dispatch(ACTIONS.SEARCH({
      category: category == '' ? undefined : category,
      keyword: keyword == '' ? undefined : keyword
    }, () => {
      setCurrentPage(1);
      setCanLoadMore(true);
    }));
  }, [category, keyword])

  return (
    <Stack flex={1}>
      <StatusBar backgroundColor='#3b82f6' barStyle='light-content' />
      <Box backgroundColor='blue.500' borderBottomRadius={15} overflow='hidden'>
        <VStack padding={3} paddingBottom={5}>
          <VStack>
              <HStack>
                { !context.is_login &&
                <Button backgroundColor='blue.400' size='sm' onPress={() => navigation.navigate('Login')}>
                  <HStack space={1} alignItems='center'>
                    <Icon as={<IconMaterial name='login' />} size={4} color='blue.100' />
                    <Text color='blue.100'>Masuk</Text>
                  </HStack>
                </Button>}
              </HStack>
            <Heading color='white'>{ context.is_login ? `Hai, ${callname(context.user?.name || '')}` : 'Perpustakaan Privos' }</Heading>
            <Text fontSize='lg' color='blue.200' marginBottom={5}>Cari buku yang dibutuhkan</Text>
          </VStack>
          <Select
            marginBottom={1}
            paddingY={2}
            selectedValue={category}
            accessibilityLabel="Select Category"
            placeholder="Select Category"
            onValueChange={(itemValue) => setCategory(itemValue)}
            backgroundColor='blue.400'
            borderWidth={0}
            color={category == '' ? 'blue.200' : 'white'}
            placeholderTextColor='blue.200'
            dropdownIcon={<IconMaterial name='chevron-down' color='#bfdbfe' size={20} style={{ marginRight: 10 }} />}
            _selectedItem={{
              bg: "blue.500",
            }}
          >
            <Select.Item label='All Category' value='' />
            {categories.map(item => <Select.Item key={item.id} label={item.name} value={item.id.toString()} />)}
          </Select>
          <Input
            paddingY={2}
            placeholder='Cari buku...'
            placeholderTextColor='blue.200'
            borderWidth={0}
            backgroundColor='blue.400'
            color='white'
            value={keyword}
            onChangeText={k => setKeyword(k)}
            InputRightElement={
              <IconButton
                _pressed={{ backgroundColor: 'transparent' }}
                display={ keyword == '' ? 'none' : 'flex' }
                onPress={() => setKeyword('')}
                paddingRight={3}
                color='white'
                icon={<IconMaterial name='close' color='#bfdbfe' />} />} />
        </VStack>
      </Box>
      { !book.loaded && <Loader containerStyle={{ flex: 1 }} label='loading' textStyle={{ fontSize: 17 }} /> }
      { book.loaded && book.datas.length <= 0 &&
      <Stack flex={1} alignItems='center' paddingY={50}>
        <Icon as={<IconMaterial name='magnify' />} size={50} color='gray.400' marginBottom={3} />
        <Text color='gray.500'>Maaf tidak ada buku yang dimaksud saat ini.</Text>
      </Stack> }
      { book.loaded && <FlatGrid
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 10 }}
        spacing={10}
        itemDimension={130}
        data={book.datas}
        keyExtractor={item => `${item.id}`}
        renderItem={renderItem}
        ListFooterComponent={
          <Box
            display={(current_page == 1 && book.datas.length < 20) ? 'none' : (can_load_more ? 'flex' : 'none')}
            paddingX={10}
            paddingBottom={7}>
            <Button disabled={loading_more} onPress={loadMore} backgroundColor='transparent' _pressed={{ backgroundColor: 'gray.300' }}>
              {loading_more ? <Loader /> : <Text color='gray.500'>Lihat Selanjutnya</Text>}
            </Button>
          </Box>
        } />}
    </Stack>
  )
}

export default Discovery;