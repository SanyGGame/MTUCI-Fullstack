import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { CategoryDot, type TransactionType } from '../../../entities/category';
import { useFinance } from '../../../entities/finance';
import { defaultDate } from '../../../shared/config';
import { useFormState } from '../../../shared/lib/useFormState';
import { hasErrors, parseMoney } from '../../../shared/lib/validation';
import AppDialog from '../../../shared/ui/AppDialog';
import { useNotify } from '../../../shared/ui/useNotify';
import { validateTransaction, type TransactionFormValues } from '../model/validate';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddTransactionDialog({ open, onClose }: Props) {
  return (
    <AppDialog open={open} onClose={onClose}>
      <TransactionForm onClose={onClose} />
    </AppDialog>
  );
}

function TransactionForm({ onClose }: { onClose: () => void }) {
  const { categories, addTransaction } = useFinance();
  const notify = useNotify();
  const { values, setValue, touch, markSubmitted, visibleError } = useFormState<TransactionFormValues>({
    type: 'expense',
    amount: '',
    date: defaultDate(),
    categoryId: '',
    description: '',
  });

  const errors = validateTransaction(values, categories);
  const err = (key: keyof TransactionFormValues) => visibleError(errors, key);
  const options = categories.filter((c) => c.type === values.type);

  const handleTypeChange = (type: TransactionType) => {
    setValue('type', type);
    setValue('categoryId', '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    markSubmitted();
    if (hasErrors(errors)) return;
    addTransaction({
      date: values.date,
      amount: parseMoney(values.amount),
      categoryId: values.categoryId,
      description: values.description.trim(),
    });
    notify('Операция добавлена');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogTitle>Новая операция</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ pt: 1 }}>
          <ToggleButtonGroup
            value={values.type}
            exclusive
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            onChange={(_, v: TransactionType | null) => v && handleTypeChange(v)}
          >
            <ToggleButton value="expense">Расход</ToggleButton>
            <ToggleButton value="income">Доход</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="Сумма, ₽"
            value={values.amount}
            onChange={(e) => setValue('amount', e.target.value)}
            onBlur={() => touch('amount')}
            error={!!err('amount')}
            helperText={err('amount') ?? ' '}
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
            autoFocus
            required
          />
          <TextField
            label="Дата"
            type="date"
            value={values.date}
            onChange={(e) => setValue('date', e.target.value)}
            onBlur={() => touch('date')}
            error={!!err('date')}
            helperText={err('date') ?? ' '}
            slotProps={{ inputLabel: { shrink: true } }}
            required
          />
          <TextField
            select
            label="Категория"
            value={values.categoryId}
            onChange={(e) => setValue('categoryId', e.target.value)}
            onBlur={() => touch('categoryId')}
            error={!!err('categoryId')}
            helperText={err('categoryId') ?? ' '}
            required
          >
            {options.map((c) => (
              <MenuItem key={c.id} value={c.id} sx={{ gap: 1.5 }}>
                <CategoryDot color={c.color} />
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Описание"
            value={values.description}
            onChange={(e) => setValue('description', e.target.value)}
            onBlur={() => touch('description')}
            error={!!err('description')}
            helperText={err('description') ?? ' '}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit" variant="contained" disableElevation>
          Добавить
        </Button>
      </DialogActions>
    </form>
  );
}
