import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CategoryDot } from '../entities/category';
import { findCategory, monthTotals, sortByDateDesc, useFinance } from '../entities/finance';
import { CURRENT_MONTH, CURRENT_MONTH_LABEL } from '../shared/config';
import { formatDate, formatRub } from '../shared/lib/format';
import DataState from '../shared/ui/DataState';
import Money from '../shared/ui/Money';
import PageHeader from '../shared/ui/PageHeader';

export default function DashboardPage() {
  const { status, error, reload, transactions, categories } = useFinance();
  const { income, expense, balance } = monthTotals(transactions, CURRENT_MONTH);
  const recent = sortByDateDesc(transactions).slice(0, 6);

  return (
    <Box>
      <PageHeader title="Обзор" subtitle={CURRENT_MONTH_LABEL} />

      <DataState
        status={status}
        error={error}
        onRetry={reload}
        isEmpty={transactions.length === 0}
        emptyTitle="Операций пока нет"
        emptyHint="Добавьте первую операцию на вкладке «Транзакции»"
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
          <Grow in appear timeout={300}>
            <Paper variant="outlined" sx={{ p: 3, flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Доходы за месяц
              </Typography>
              <Typography variant="h4">
                <Money amount={income} type="income" />
              </Typography>
            </Paper>
          </Grow>
          <Grow in appear timeout={500}>
            <Paper variant="outlined" sx={{ p: 3, flex: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Расходы за месяц
              </Typography>
              <Typography variant="h4">
                <Money amount={expense} type="expense" />
              </Typography>
            </Paper>
          </Grow>
          <Grow in appear timeout={700}>
            <Paper variant="outlined" sx={{ p: 3, flex: 1, bgcolor: 'primary.main' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }} gutterBottom>
                Баланс
              </Typography>
              <Typography variant="h4" sx={{ color: '#fff' }}>
                {formatRub(balance)}
              </Typography>
            </Paper>
          </Grow>
        </Stack>

        <Typography variant="h6" gutterBottom>
          Последние операции
        </Typography>
        <Paper variant="outlined">
          <Stack divider={<Divider />}>
            {recent.map((t) => {
              const cat = findCategory(categories, t.categoryId);
              return (
                <Box
                  key={t.id}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CategoryDot color={cat?.color} size={8} />
                    <Box>
                      <Typography variant="body1">{t.description || cat?.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cat?.name} · {formatDate(t.date)}
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
      </DataState>
    </Box>
  );
}
