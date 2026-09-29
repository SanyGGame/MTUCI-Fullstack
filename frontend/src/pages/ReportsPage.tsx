import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { mockMonthlySummary } from '../api/mockSummary';
import Money from '../components/Money';

export default function ReportsPage() {
  const latest = mockMonthlySummary[mockMonthlySummary.length - 1];
  const maxValue = Math.max(...mockMonthlySummary.flatMap((m) => [m.income, m.expense]));

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Отчёты
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Динамика за последние 6 месяцев
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />}>
            Экспорт CSV
          </Button>
          <Button variant="outlined" startIcon={<FileDownloadOutlinedIcon />}>
            Экспорт PDF
          </Button>
        </Stack>
      </Box>

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
          {mockMonthlySummary.map((m) => (
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
          {mockMonthlySummary.map((m) => (
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
    </Box>
  );
}
