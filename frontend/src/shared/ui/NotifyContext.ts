import { createContext } from 'react';

export type NotifySeverity = 'success' | 'error';

export interface NotifyContextValue {
  notify: (message: string, severity?: NotifySeverity) => void;
}

export const NotifyContext = createContext<NotifyContextValue>({ notify: () => {} });
