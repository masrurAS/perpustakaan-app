import React, { FC, useContext, useEffect, useState } from 'react';
import { Stack, Heading, Image, Button, Input, ScrollView, Text, Icon, IconButton } from 'native-base';
import { Dimensions } from 'react-native';
import AppContext from '@components/AppContext';
import ErrorException from '@http/exception/ErrorException';
import { capitalize } from '@support/functions';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';

const Login: FC = () => {
  const context = useContext(AppContext);
  const [credential, setCredential] = useState({
    email: 'ifanfairuz@gmail.com',
    password: 'ifanfairuz'
  });
  const [loading, setLoading] = useState(false);
  const [show_password, showPassword] = useState(false);
  const [error_message, setErrorMessage] = useState('');

  const validate = () => {
    if (credential.email == '') {
      setErrorMessage('Email harus diisi.');
      return false;
    }
    if (credential.password == '') {
      setErrorMessage('Password harus diisi.');
      return false;
    }

    setErrorMessage('');
    return true;
  }

  const doLogin = () => {
    if (!validate()) return;

    setLoading(true);
    context.login(credential.email, credential.password)
    .then(res => {
      if (!res) {
        setErrorMessage('Email atau Password salah.')
      } else if (res instanceof ErrorException && res.errorObject?.response?.data?.errors) {
        const errors = Object.values<string[]>(res.errorObject.response.data.errors);
        const message = errors.shift()?.shift() || 'Email atau Password salah.';
        setErrorMessage(capitalize(message));
      }
    })
    .finally(() => {
      setLoading(false);
    });
  }

  return (
    <ScrollView backgroundColor='white'>
      <Stack
        flex={1}
        minHeight={Dimensions.get('window').height * 8 / 10}>
        <Stack
          alignItems='center'
          justifyContent='center'
          flex={1}
          padding={10}>
          <Image source={require('@images/logo.png')} alt='logo' width={120} height={120} resizeMode='contain' />
          <Heading color='gray.500' fontSize='3xl'>Perpustakaan</Heading>
          <Heading marginBottom={5} fontSize='4xl'>PRIVOS</Heading>
          {error_message != '' && <Text color='red.500' alignSelf='center' marginBottom={5} marginTop={-3}>{error_message}</Text>}
          <Input
            isDisabled={loading}
            keyboardType='email-address'
            w="100%"
            mx={3}
            placeholder="Email"
            marginBottom={2}
            value={credential.email}
            onChangeText={email => setCredential({ ...credential, email })} />
          <Input
            isDisabled={loading}
            type={show_password ? 'text' : 'password'}
            w="100%"
            mx={3}
            placeholder="Password"
            marginBottom={2}
            value={credential.password}
            onChangeText={password => setCredential({ ...credential, password })}
            InputRightElement={
              <IconButton
                _pressed={{ backgroundColor: 'transparent' }}
                onPress={() => showPassword(!show_password)}
                icon={<Icon
                  as={<IconMaterial name='eye' />}
                  size={5}
                  color={show_password ? 'blue.500' : 'gray.400'} />} />
            } />
          <Button w='100%' backgroundColor='blue.500' onPress={doLogin} isLoading={loading}>{loading ? '' : 'SignIn'}</Button>
        </Stack>
        <Text color='gray.400' alignSelf='center' marginBottom={20}>&copy; SMK Negeri Prigen</Text>
      </Stack>
    </ScrollView>
  )
}

export default Login;