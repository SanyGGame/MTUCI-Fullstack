import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { mockBudgets } from '../api/mockBudgets';
import { getCategoryById } from '../api/mockCategories';
import Money from '../shared/ui/Money';

export default function BudgetsPage() {
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
            Бюджеты
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Сентябрь 2026
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} disableElevation>
          Новый бюджет
        </Button>
      </Box>

      <Stack spacing={2}>
        {mockBudgets.map((b) => {
          const cat = getCategoryById(b.categoryId);
          const pct = Math.min(100, Math.round((b.spent / b.monthlyLimit) * 100));
          const over = b.spent > b.monthlyLimit;
          return (
            <Paper key={b.id} variant="outlined" sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  mb: 1.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      bgcolor: cat?.color,
                    }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {cat?.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color={over ? 'error.main' : 'text.secondary'}>
                  <Money amount={b.spent} /> из <Money amount={b.monthlyLimit} />
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#EDE9DD',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    bgcolor: over ? 'error.main' : 'primary.main',
                  },
                }}
              />
              {over && (
                <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                  Превышение бюджета на <Money amount={b.spent - b.monthlyLimit} />
                </Typography>
              )}
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
