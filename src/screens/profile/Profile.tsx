import React, { FC, useContext } from 'react';
import { Box, Image, Text, VStack, HStack, Button } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppContext from '@components/AppContext';
import { Alert } from 'react-native';
import { genUrlStorage } from '@support/functions';

const placeholder = require('@images/placeholder_user.png');
const Profile: FC = () => {
  const context = useContext(AppContext);
  const { user } = context;

  const doLogout = () => {
    Alert.alert('Keluar', 'Apakah yakin akan keluar dari akun ?', [
      {
        text: 'Batal'
      },
      {
        text: 'Yakin',
        onPress: () => context.logout()
      }
    ], { cancelable: true })
  }
  console.log(user)
  return (
    <Box paddingY={10}>
      <VStack alignItems='center' marginBottom={10}>
        <Image
          marginBottom={5}
          width={100}
          height={100}
          borderRadius={200}
          resizeMode='center'
          source={{ uri: genUrlStorage(user?.photo || '', true) }}
          defaultSource={placeholder}
          fallbackSource={placeholder}
          alt='profile' />
        <Text fontSize='2xl' bold>{ user?.name }</Text>
      </VStack>
      <VStack marginBottom={10}>
        <Button
          _pressed={{ backgroundColor: 'gray.200' }}
          paddingX={5}
          onPress={doLogout}
          justifyContent='flex-start' backgroundColor='transparent'>
          <HStack space={2} alignItems='center'>
            <Icon name='logout' size={25} />
            <Text fontSize='lg' bold>Keluar</Text>
          </HStack>
        </Button>
      </VStack>
    </Box>
  )
}

export default Profile;