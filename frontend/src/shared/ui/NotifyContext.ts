import { createContext } from 'react';

export interface NotifyContextValue {
  notify: (message: string) => void;
}

export const NotifyContext = createContext<NotifyContextValue>({ notify: () => {} });
