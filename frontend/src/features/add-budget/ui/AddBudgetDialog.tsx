import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { CategoryDot } from '../../../entities/category';
import { useFinance } from '../../../entities/finance';
import { useFormState } from '../../../shared/lib/useFormState';
import { hasErrors, parseMoney } from '../../../shared/lib/validation';
import AppDialog from '../../../shared/ui/AppDialog';
import { useNotify } from '../../../shared/ui/useNotify';
import { validateBudget, type BudgetFormValues } from '../model/validate';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddBudgetDialog({ open, onClose }: Props) {
  return (
    <AppDialog open={open} onClose={onClose}>
      <BudgetForm onClose={onClose} />
    </AppDialog>
  );
}

function BudgetForm({ onClose }: { onClose: () => void }) {
  const { categories, budgets, addBudget } = useFinance();
  const notify = useNotify();
  const { values, setValue, touch, markSubmitted, visibleError } = useFormState<BudgetFormValues>({
    categoryId: '',
    limit: '',
  });

  const available = categories.filter(
    (c) => c.type === 'expense' && !budgets.some((b) => b.categoryId === c.id),
  );

  const errors = validateBudget(values);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    markSubmitted();
    if (hasErrors(errors)) return;
    addBudget({ categoryId: values.categoryId, monthlyLimit: parseMoney(values.limit) });
    notify('Бюджет добавлен');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogTitle>Новый бюджет</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ pt: 1 }}>
          {available.length === 0 ? (
            <Alert severity="info">
              Для всех категорий расходов бюджет уже задан. Добавьте новую категорию.
            </Alert>
          ) : (
            <>
              <TextField
                select
                label="Категория"
                value={values.categoryId}
                onChange={(e) => setValue('categoryId', e.target.value)}
                onBlur={() => touch('categoryId')}
                error={!!visibleError(errors, 'categoryId')}
                helperText={visibleError(errors, 'categoryId') ?? ' '}
                required
              >
                {available.map((c) => (
                  <MenuItem key={c.id} value={c.id} sx={{ gap: 1.5 }}>
                    <CategoryDot color={c.color} />
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Лимит на месяц, ₽"
                value={values.limit}
                onChange={(e) => setValue('limit', e.target.value)}
                onBlur={() => touch('limit')}
                error={!!visibleError(errors, 'limit')}
                helperText={visibleError(errors, 'limit') ?? ' '}
                slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                required
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit" variant="contained" disableElevation disabled={available.length === 0}>
          Добавить
        </Button>
      </DialogActions>
    </form>
  );
}
