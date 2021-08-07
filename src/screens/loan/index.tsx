import React, { FC } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListLoan from './ListLoan';
import Detail from './Detail';
import { Loan } from '@store/_entity';

export type LoanNavigationProps = {
  Detail: {
    data: Loan
  }
}

const LoanNavigation = createStackNavigator();
const LoanScreen: FC = () => {
  return (
    <LoanNavigation.Navigator>
      <LoanNavigation.Screen name='ListLoan' component={ListLoan} options={{
        headerStyle: {
          backgroundColor: '#3b82f6'
        },
        headerTitle: 'Peminjaman',
        headerTitleStyle: {
          color: 'white'
        }
      }} />
      <LoanNavigation.Screen name='Detail' component={Detail} options={{ headerTitle: 'Detail Peminjaman' }} />
    </LoanNavigation.Navigator>
  )
}

export default LoanScreen;