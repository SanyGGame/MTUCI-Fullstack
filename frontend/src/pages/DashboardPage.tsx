import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { mockTransactions, getRecentTransactions } from '../api/mockTransactions';
import { getCategoryById } from '../api/mockCategories';
import Money from '../components/Money';

function useMonthTotals() {
  const income = mockTransactions
    .filter((t) => t.type === 'income' && t.date.startsWith('2026-09'))
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = mockTransactions
    .filter((t) => t.type === 'expense' && t.date.startsWith('2026-09'))
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expense, balance: income - expense };
}

export default function DashboardPage() {
  const { income, expense, balance } = useMonthTotals();
  const recent = getRecentTransactions(6);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Обзор
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Сентябрь 2026
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
        <Paper variant="outlined" sx={{ p: 3, flex: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Доходы за месяц
          </Typography>
          <Typography variant="h4">
            <Money amount={income} type="income" />
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 3, flex: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Расходы за месяц
          </Typography>
          <Typography variant="h4">
            <Money amount={expense} type="expense" />
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 3, flex: 1, bgcolor: 'primary.main' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }} gutterBottom>
            Баланс
          </Typography>
          <Typography variant="h4" sx={{ color: '#fff'}}>
            {new Intl.NumberFormat('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              maximumFractionDigits: 0,
            }).format(balance)}
          </Typography>
        </Paper>
      </Stack>

      <Typography variant="h6" gutterBottom>
        Последние операции
      </Typography>
      <Paper variant="outlined">
        <Stack divider={<Divider />}>
          {recent.map((t) => {
            const cat = getCategoryById(t.categoryId);
            return (
              <Box
                key={t.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 3,
                  py: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: cat?.color ?? '#8A8577',
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="body1">{t.description}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {cat?.name} · {new Date(t.date).toLocaleDateString('ru-RU')}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1">
                  <Money amount={t.amount} type={t.type} />
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Paper>
    </Box>
  );
}
