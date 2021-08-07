import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Discovery from './Discovery';
import Detail from './Detail';
import { Book } from '@store/_entity';

export type BookNavigationProps = {
  Detail: {
    data: Book
  }
}

const BookNavigation = createStackNavigator();
const BookScreen: FC = () => {
  return (
    <BookNavigation.Navigator>
      <BookNavigation.Screen name='Discovery' component={Discovery} options={{ headerShown: false }} />
      <BookNavigation.Screen name='Detail' component={Detail}  />
    </BookNavigation.Navigator>
  )
}

export default BookScreen;