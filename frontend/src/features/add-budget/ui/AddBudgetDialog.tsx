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
import type { Budget } from '../../../entities/budget';
import { useFormState } from '../../../shared/lib/useFormState';
import { useSubmit } from '../../../shared/lib/useSubmit';
import { hasErrors, parseMoney } from '../../../shared/lib/validation';
import AppDialog from '../../../shared/ui/AppDialog';
import { useNotify } from '../../../shared/ui/useNotify';
import { validateBudget, type BudgetFormValues } from '../model/validate';

interface Props {
  open: boolean;
  onClose: () => void;
  budget?: Budget;
}

export default function AddBudgetDialog({ open, onClose, budget }: Props) {
  return (
    <AppDialog open={open} onClose={onClose}>
      <BudgetForm onClose={onClose} budget={budget} />
    </AppDialog>
  );
}

function BudgetForm({ onClose, budget }: { onClose: () => void; budget?: Budget }) {
  const { categories, budgets, addBudget, updateBudget } = useFinance();
  const notify = useNotify();
  const { submitting, error: serverError, submit } = useSubmit();
  const { values, setValue, touch, markSubmitted, visibleError } = useFormState<BudgetFormValues>({
    categoryId: budget?.categoryId ?? '',
    limit: budget ? String(budget.monthlyLimit) : '',
  });

  const available = categories.filter(
    (c) => c.type === 'expense' && (c.id === budget?.categoryId || !budgets.some((b) => b.categoryId === c.id)),
  );

  const errors = validateBudget(values);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    markSubmitted();
    if (hasErrors(errors)) return;
    const limit = parseMoney(values.limit);
    const ok = await submit(() =>
      budget ? updateBudget(budget.id, limit) : addBudget({ categoryId: values.categoryId, monthlyLimit: limit }),
    );
    if (ok) {
      notify(budget ? 'Бюджет обновлён' : 'Бюджет добавлен');
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogTitle>{budget ? 'Редактирование бюджета' : 'Новый бюджет'}</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ pt: 1 }}>
          {serverError && <Alert severity="error">{serverError}</Alert>}
          {available.length === 0 ? (
            <Alert severity="info">
              Для всех категорий расходов бюджет уже задан. Добавьте новую категорию.
            </Alert>
          ) : (
            <>
              <TextField
                select
                disabled={!!budget}
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
        <Button type="submit" variant="contained" disableElevation disabled={available.length === 0 || submitting}>
          {budget ? 'Сохранить' : 'Добавить'}
        </Button>
      </DialogActions>
    </form>
  );
}
