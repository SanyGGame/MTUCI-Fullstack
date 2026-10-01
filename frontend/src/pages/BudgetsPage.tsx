import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import type { Budget } from '../entities/budget';
import { CategoryDot } from '../entities/category';
import { findCategory, useFinance } from '../entities/finance';
import { AddBudgetDialog } from '../features/add-budget';
import { DeleteBudgetButton } from '../features/delete-budget';
import { CURRENT_MONTH_LABEL } from '../shared/config';
import DataState from '../shared/ui/DataState';
import Money from '../shared/ui/Money';
import PageHeader from '../shared/ui/PageHeader';

export default function BudgetsPage() {
  const { status, error, reload, budgets, categories } = useFinance();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | undefined>();

  const addButton = (
    <Button variant="contained" startIcon={<AddIcon />} disableElevation onClick={() => {
        setEditing(undefined);
        setDialogOpen(true);
      }}
    >
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
          {budgets.map((b) => {
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" color={over ? 'error.main' : 'text.secondary'} sx={{ mr: 1 }}>
                        <Money amount={b.spent} /> из <Money amount={b.monthlyLimit} />
                      </Typography>
                      <IconButton
                        size="small"
                        aria-label="Изменить бюджет"
                        onClick={() => {
                          setEditing(b);
                          setDialogOpen(true);
                        }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <DeleteBudgetButton budgetId={b.id} name={cat?.name ?? ''} />
                    </Box>
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

      <AddBudgetDialog open={dialogOpen} budget={editing} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
