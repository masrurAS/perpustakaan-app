import ErrorException from '@http/exception/ErrorException';
import { Me } from '@store/_entity';
import React from 'react';

interface AppContextInterface {
  token?: string
  user?: Me,
  is_login: boolean,
  cek_session: () => Promise<void>,
  login: (email: string, password: string) => Promise<ErrorException | Me | undefined>
  logout: () => Promise<void>
}

const AppContext = React.createContext<AppContextInterface>({
  token: undefined,
  user: undefined,
  is_login: false,
  cek_session: async () => {},
  login: async (email: string, password: string) => undefined,
  logout: async () => {}
})

export type AppContextValue = AppContextInterface;
export const AppProvider = AppContext.Provider;
export default AppContext;