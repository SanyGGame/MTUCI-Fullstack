import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { CategoryDot } from '../entities/category';
import { budgetsWithSpent, findCategory, useFinance } from '../entities/finance';
import { AddBudgetDialog } from '../features/add-budget';
import { CURRENT_MONTH, CURRENT_MONTH_LABEL } from '../shared/config';
import DataState from '../shared/ui/DataState';
import Money from '../shared/ui/Money';
import PageHeader from '../shared/ui/PageHeader';

export default function BudgetsPage() {
  const { status, error, reload, budgets, categories, transactions } = useFinance();
  const [dialogOpen, setDialogOpen] = useState(false);
  const items = budgetsWithSpent(budgets, transactions, CURRENT_MONTH);

  const addButton = (
    <Button variant="contained" startIcon={<AddIcon />} disableElevation onClick={() => setDialogOpen(true)}>
      Новый бюджет
    </Button>
  );

  return (
    <Box>
      <PageHeader title="Бюджеты" subtitle={CURRENT_MONTH_LABEL} action={addButton} />

      <DataState
        status={status}
        error={error}
        onRetry={reload}
        isEmpty={budgets.length === 0}
        emptyTitle="Бюджетов пока нет"
        emptyHint="Задайте месячный лимит расходов для категории"
        emptyAction={addButton}
      >
        <Stack spacing={2}>
          {items.map((b) => {
            const cat = findCategory(categories, b.categoryId);
            const pct = Math.min(100, Math.round((b.spent / b.monthlyLimit) * 100));
            const over = b.spent > b.monthlyLimit;
            return (
              <Slide key={b.id} in appear direction="up" timeout={350}>
                <Paper variant="outlined" sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CategoryDot color={cat?.color} />
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
                        transition: 'transform 0.6s ease',
                      },
                    }}
                  />
                  {over && (
                    <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                      Превышение бюджета на <Money amount={b.spent - b.monthlyLimit} />
                    </Typography>
                  )}
                </Paper>
              </Slide>
            );
          })}
        </Stack>
      </DataState>

      <AddBudgetDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
