import Alert from '@mui/material/Alert';
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
import { useSubmit } from '../../../shared/lib/useSubmit';
import type { Transaction } from '../../../entities/transaction';
import { hasErrors, parseMoney } from '../../../shared/lib/validation';
import AppDialog from '../../../shared/ui/AppDialog';
import { useNotify } from '../../../shared/ui/useNotify';
import { validateTransaction, type TransactionFormValues } from '../model/validate';

interface Props {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction;
}

export default function AddTransactionDialog({ open, onClose, transaction }: Props) {
  return (
    <AppDialog open={open} onClose={onClose}>
      <TransactionForm onClose={onClose} transaction={transaction} />
    </AppDialog>
  );
}

function TransactionForm({ onClose, transaction }: { onClose: () => void; transaction?: Transaction }) {
  const { categories, addTransaction, updateTransaction } = useFinance();
  const notify = useNotify();
  const { submitting, error: serverError, submit } = useSubmit();
  const { values, setValue, touch, markSubmitted, visibleError } = useFormState<TransactionFormValues>({
    type: transaction?.type ?? 'expense',
    amount: transaction ? String(transaction.amount) : '',
    date: transaction?.date ?? defaultDate(),
    categoryId: transaction?.categoryId ?? '',
    description: transaction?.description ?? '',
  });

  const errors = validateTransaction(values, categories);
  const err = (key: keyof TransactionFormValues) => visibleError(errors, key);
  const options = categories.filter((c) => c.type === values.type);

  const handleTypeChange = (type: TransactionType) => {
    setValue('type', type);
    setValue('categoryId', '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    markSubmitted();
    if (hasErrors(errors)) return;
    const payload = {
      date: values.date,
      amount: parseMoney(values.amount),
      categoryId: values.categoryId,
      description: values.description.trim(),
    };
    const ok = await submit(() =>
      transaction ? updateTransaction(transaction.id, payload) : addTransaction(payload),
    );
    if (ok) {
      notify(transaction ? 'Операция обновлена' : 'Операция добавлена');
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogTitle>{transaction ? 'Редактирование операции' : 'Новая операция'}</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ pt: 1 }}>
          {serverError && <Alert severity="error">{serverError}</Alert>}
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
        <Button type="submit" variant="contained" disableElevation disabled={submitting}>
          {transaction ? 'Сохранить' : 'Добавить'}
        </Button>
      </DialogActions>
    </form>
  );
}
