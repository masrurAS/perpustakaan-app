import React, { FC } from 'react';
import { Stack, Heading, Image, Text } from 'native-base';
import { Dimensions } from 'react-native';
import Loader from '@components/Loader';

const SplashScreen: FC = () => {
  return (
    <Stack backgroundColor='white' flex={1}>
      <Stack
        alignItems='center'
        justifyContent='center'
        flex={1}
        padding={10}>
        <Image source={require('@images/logo.png')} alt='logo' width={120} height={120} resizeMode='contain' />
        <Heading color='gray.500' fontSize='3xl'>Perpustakaan</Heading>
        <Heading marginBottom={5} fontSize='4xl'>PRIVOS</Heading>
        <Loader containerStyle={{ paddingVertical: 20 }} />
      </Stack>
      <Text color='gray.400' alignSelf='center' marginBottom={20}>&copy; SMK Negeri Prigen</Text>
    </Stack>
  )
}

export default SplashScreen;