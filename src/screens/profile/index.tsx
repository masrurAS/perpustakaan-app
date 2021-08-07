import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from './Profile';

export type ProfileNavigationProps = {
  
}

const ProfileNavigation = createStackNavigator();
const ProfileScreen: FC = () => {
  return (
    <ProfileNavigation.Navigator>
      <ProfileNavigation.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
    </ProfileNavigation.Navigator>
  )
}

export default ProfileScreen;