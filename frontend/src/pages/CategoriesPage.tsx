import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { CategoryDot, type Category } from '../entities/category';
import { sumByCategory, useFinance } from '../entities/finance';
import { AddCategoryDialog } from '../features/add-category';
import DataState from '../shared/ui/DataState';
import Money from '../shared/ui/Money';
import PageHeader from '../shared/ui/PageHeader';

export default function CategoriesPage() {
  const { status, error, reload, categories, transactions } = useFinance();
  const [dialogOpen, setDialogOpen] = useState(false);

  const renderGroup = (title: string, items: Category[]) => (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {items.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Категорий пока нет
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {items.map((cat) => (
            <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Grow in appear>
                <Paper variant="outlined" sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <CategoryDot color={cat.color} />
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {cat.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Всего: <Money amount={sumByCategory(transactions, cat.id)} />
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const addButton = (
    <Button variant="contained" startIcon={<AddIcon />} disableElevation onClick={() => setDialogOpen(true)}>
      Новая категория
    </Button>
  );

  return (
    <Box>
      <PageHeader title="Категории" subtitle={`${categories.length} категорий`} action={addButton} />

      <DataState
        status={status}
        error={error}
        onRetry={reload}
        isEmpty={categories.length === 0}
        emptyTitle="Категорий пока нет"
        emptyHint="Создайте категорию, чтобы группировать операции"
        emptyAction={addButton}
      >
        {renderGroup('Доходы', categories.filter((c) => c.type === 'income'))}
        {renderGroup('Расходы', categories.filter((c) => c.type === 'expense'))}
      </DataState>

      <AddCategoryDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
