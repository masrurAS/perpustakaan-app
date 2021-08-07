import React, { FC, useContext } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './auth/Login';
import Book from './book';
import Loan from './loan';
import Profile from './profile';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppContext from '@components/AppContext';
import { LoanProvider } from '@components/LoanContext';

const BottomNavigation = createBottomTabNavigator();

const Bottom: FC = () => {
  return (
    <BottomNavigation.Navigator>
      <BottomNavigation.Screen name='Book' component={Book} options={{
        tabBarLabel: 'Buku',
        tabBarIcon: ({ color, size }) => <Icon name='bookshelf' color={color} size={size} />
      }} />
      <BottomNavigation.Screen name='Loan' component={Loan} options={{
        tabBarLabel: 'Peminjaman',
        tabBarIcon: ({ color, size }) => <Icon name='book' color={color} size={size} />
      }} />
      <BottomNavigation.Screen name='Profile' component={Profile} options={{
        tabBarLabel: 'Profil',
        tabBarIcon: ({ color, size }) => <Icon name='account' color={color} size={size} />
      }} />
    </BottomNavigation.Navigator>
  )
}

const MainNavigation = createStackNavigator();

const MainAuth: FC = () => {
  return (
    <LoanProvider>
      <MainNavigation.Navigator>
        <MainNavigation.Screen name='Main' component={Bottom} options={{ headerShown: false }} />
      </MainNavigation.Navigator>
    </LoanProvider>
  )
}

const MainUnauth: FC = () => {
  return (
    <MainNavigation.Navigator>
      <MainNavigation.Screen name='Book' component={Book} options={{ headerShown: false }} />
      <MainNavigation.Screen name='Login' component={Login} />
    </MainNavigation.Navigator>
  )
}

const Main: FC = () => {
  const context = useContext(AppContext);
  if (context.is_login) {
    return <MainAuth />
  } else {
    return <MainUnauth />
  }
}

export default Main;