import Box from '@mui/material/Box';
import { formatRub } from '../lib/format';

interface MoneyProps {
  amount: number;
  type?: 'income' | 'expense' | 'neutral';
}

export default function Money({ amount, type = 'neutral' }: MoneyProps) {
  const color =
    type === 'income' ? 'success.main' : type === 'expense' ? 'error.main' : 'inherit';
  const sign = type === 'income' ? '+' : type === 'expense' ? '−' : '';

  return (
    <Box component="span" sx={{ color }}>
      {sign}
      {formatRub(Math.abs(amount))}
    </Box>
  );
}
