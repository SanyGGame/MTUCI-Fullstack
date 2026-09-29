import Box from '@mui/material/Box';

interface MoneyProps {
  amount: number;
  type?: 'income' | 'expense' | 'neutral';
}

export default function Money({ amount, type = 'neutral' }: MoneyProps) {
  const color =
    type === 'income' ? '#2D5F4C' : type === 'expense' ? '#B8452F' : 'inherit';
  const sign = type === 'income' ? '+' : type === 'expense' ? '−' : '';

  const formatted = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  return (
    <Box component="span" sx={{ color }}>
      {sign}
      {formatted}
    </Box>
  );
}
