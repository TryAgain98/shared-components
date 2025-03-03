import { Provider } from 'react-redux';
import { store } from '.';
import { ReactNode } from 'react';

export interface ComponentsProviderProps {
    children: ReactNode;
  }         

export const ComponentsProvider = ({ children }: ComponentsProviderProps) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};