import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { mockCategories } from '../api/mockCategories';
import { mockTransactions } from '../api/mockTransactions';
import Money from '../shared/ui/Money';

function totalForCategory(categoryId: string): number {
  return mockTransactions
    .filter((t) => t.categoryId === categoryId)
    .reduce((sum, t) => sum + t.amount, 0);
}

export default function CategoriesPage() {
  const income = mockCategories.filter((c) => c.type === 'income');
  const expense = mockCategories.filter((c) => c.type === 'expense');

  const renderGroup = (title: string, items: typeof mockCategories) => (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {items.map((cat) => (
          <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: cat.color,
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {cat.name}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Всего: <Money amount={totalForCategory(cat.id)} />
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

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
            Категории
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {mockCategories.length} категорий
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} disableElevation>
          Новая категория
        </Button>
      </Box>

      {renderGroup('Доходы', income)}
      {renderGroup('Расходы', expense)}
    </Box>
  );
}
