import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { Category } from '../entities/category';
import type { Transaction } from '../entities/transaction';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { findCategory, useFinance } from '../entities/finance';
import { CURRENT_MONTH_LABEL } from '../shared/config';
import DataState from '../shared/ui/DataState';
import Money from '../shared/ui/Money';
import PageHeader from '../shared/ui/PageHeader';

function exportCsv(transactions: Transaction[], categories: Category[]) {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const rows = [
    ['Дата', 'Тип', 'Категория', 'Сумма', 'Описание'],
    ...transactions.map((t) => [
      t.date,
      t.type === 'income' ? 'Доход' : 'Расход',
      findCategory(categories, t.categoryId)?.name ?? '',
      String(t.amount),
      t.description,
    ]),
  ];
  const csv = '\uFEFF' + rows.map((r) => r.map(escape).join(';')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'transactions.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { status, error, reload, transactions, categories, summary } = useFinance();

  const months = summary.map((m) => ({
    ...m,
    label: new Date(`${m.month}-01`).toLocaleDateString('ru-RU', { month: 'short' }).replace('.', ''),
  }));
  const latest = months[months.length - 1] ?? { income: 0, expense: 0 };
  const maxValue = Math.max(1, ...months.flatMap((m) => [m.income, m.expense]));

  return (
    <Box>
      <PageHeader
        title="Отчёты"
        subtitle="Динамика за последние 6 месяцев"
        action={
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon />}
            disabled={status !== 'ready' || transactions.length === 0}
            onClick={() => exportCsv(transactions, categories)}
          >
            Экспорт CSV
          </Button>
        }
      />

      <DataState status={status} error={error} onRetry={reload}>
      <Paper variant="outlined" sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#2D5F4C', mt: 0.3 }} />
          <Typography variant="body2" color="text.secondary">
            Доходы
          </Typography>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#B8452F', mt: 0.3, ml: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Расходы
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 3,
            height: 220,
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 0,
          }}
        >
          {months.map((m) => (
            <Box key={m.month} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, height: 190 }}>
                <Box
                  sx={{
                    width: 18,
                    height: `${(m.income / maxValue) * 100}%`,
                    bgcolor: '#2D5F4C',
                    borderRadius: '3px 3px 0 0',
                  }}
                />
                <Box
                  sx={{
                    width: 18,
                    height: `${(m.expense / maxValue) * 100}%`,
                    bgcolor: '#B8452F',
                    borderRadius: '3px 3px 0 0',
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
          {months.map((m) => (
            <Typography
              key={m.month}
              variant="body2"
              color="text.secondary"
              sx={{ flex: 1, textAlign: 'center' }}
            >
              {m.label}
            </Typography>
          ))}
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Сводка: {CURRENT_MONTH_LABEL}
        </Typography>
        <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Доходы
            </Typography>
            <Typography variant="h5">
              <Money amount={latest.income} type="income" />
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Расходы
            </Typography>
            <Typography variant="h5">
              <Money amount={latest.expense} type="expense" />
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Накоплено
            </Typography>
            <Typography variant="h5">
              <Money amount={latest.income - latest.expense} />
            </Typography>
          </Box>
        </Stack>
      </Paper>
      </DataState>
    </Box>
  );
}
