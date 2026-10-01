import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { monthTotals, mockMonthlySummary, useFinance, type MonthlySummary } from '../entities/finance';
import { CURRENT_MONTH } from '../shared/config';
import DataState from '../shared/ui/DataState';
import Money from '../shared/ui/Money';
import PageHeader from '../shared/ui/PageHeader';

export default function ReportsPage() {
  const { status, error, reload, transactions } = useFinance();

  const { income, expense } = monthTotals(transactions, CURRENT_MONTH);
  const latest: MonthlySummary = { month: 'Сен', income, expense };
  const months = [...mockMonthlySummary.slice(0, -1), latest];
  const maxValue = Math.max(1, ...months.flatMap((m) => [m.income, m.expense]));

  return (
    <Box>
      <PageHeader
        title="Отчёты"
        subtitle="Динамика за последние 6 месяцев"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />}>
              Экспорт CSV
            </Button>
            <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />}>
              Экспорт PDF
            </Button>
          </Stack>
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
              {m.month}
            </Typography>
          ))}
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Сводка за сентябрь
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
