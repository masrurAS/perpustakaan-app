import 'react-native-gesture-handler';
import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { extendTheme, NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import custom_theme from './src/theme/custom';
import { Main } from './src/screens';
import store from './src/store';
import { ACTIONS } from '@store/reducers/category';
import { AppContextValue, AppProvider } from '@components/AppContext';
import { Me } from '@store/_entity';
import { AuthResponse } from '@http/Response';
import { destroy_session, get_session, set_session } from '@support/session';
import { cek_session, login, logout } from '@actions/auth';
import ErrorException from '@http/exception/ErrorException';
import SplashScreen from '@screens/SplashScreen';

const App: FC = () => {
  const theme = extendTheme(custom_theme);
  const [contextData, setContextData] = useState<{
    token?: string
    user?: Me,
  }>({
    token: undefined,
    user: undefined,
  });
  const [loading, setLoading] = useState(true);
  
  const init_form = async () => {
    await store.dispatch<any>(ACTIONS.GET_FROM_SERVER());
  }

  const _get_user = async (token: string) => {
    const res = await cek_session(token);
    if (res && res.data) {
      return res.data;
    } else {
      await destroy_session();
    }
    return undefined;
  }
  const _cek_session = async () => {
    const session = await get_session();
    if (typeof session.token === 'string' && session.token != '') {
      const user = await _get_user(session.token);
      setContextData({
        ...contextData,
        user,
        token: session.token
      })
    }
    setLoading(false);
  }
  const _login = async (email: string, password: string) => {
    const res = await login(email, password);
    if (res instanceof AuthResponse && res.data) {
      const token = res.data.token;
      const user = await _get_user(token);
      if (user) {
        set_session('token', token);
        setContextData({
          ...contextData,
          token, user
        });
      }
      return user;
    } else if (res instanceof ErrorException) {
      return res;
    }
  }

  const _logout = async () => {
    setLoading(true);
    const res = await logout();
    if (res) {
      setContextData({
        token: undefined,
        user: undefined
      })
    }
    setLoading(false);
  }

  const appContext = useMemo<AppContextValue>(() => ({
    token: contextData.token,
    user: contextData.user,
    is_login: !!contextData.user?.id,
    login: _login,
    logout: _logout,
    cek_session: _cek_session
  }), [contextData]);

  useEffect(() => {
    setLoading(true);
    _cek_session();
    init_form();
  }, [])

  return (
    <AppProvider value={appContext}>
      <Provider store={store}>
        <NativeBaseProvider theme={theme}>
          <NavigationContainer>
            {loading ? <SplashScreen /> : <Main />}
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  
});

export default App;
