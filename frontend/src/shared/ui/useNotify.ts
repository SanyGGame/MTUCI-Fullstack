import { useContext } from 'react';
import { NotifyContext } from './NotifyContext';

export function useNotify() {
  return useContext(NotifyContext).notify;
}
