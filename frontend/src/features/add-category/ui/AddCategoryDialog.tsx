import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import type { Category, TransactionType } from '../../../entities/category';
import { useFinance } from '../../../entities/finance';
import { useFormState } from '../../../shared/lib/useFormState';
import { useSubmit } from '../../../shared/lib/useSubmit';
import { hasErrors } from '../../../shared/lib/validation';
import AppDialog from '../../../shared/ui/AppDialog';
import { useNotify } from '../../../shared/ui/useNotify';
import { CATEGORY_COLORS, validateCategory, type CategoryFormValues } from '../model/validate';

interface Props {
  open: boolean;
  onClose: () => void;
  category?: Category;
}

export default function AddCategoryDialog({ open, onClose, category }: Props) {
  return (
    <AppDialog open={open} onClose={onClose}>
      <CategoryForm onClose={onClose} category={category} />
    </AppDialog>
  );
}

function CategoryForm({ onClose, category }: { onClose: () => void; category?: Category }) {
  const { categories, addCategory, updateCategory } = useFinance();
  const notify = useNotify();
  const { submitting, error: serverError, submit } = useSubmit();
  const { values, setValue, touch, markSubmitted, visibleError } = useFormState<CategoryFormValues>({
    name: category?.name ?? '',
    type: category?.type ?? 'expense',
    color: category?.color ?? CATEGORY_COLORS[0],
  });

  const errors = validateCategory(
    values,
    categories.filter((c) => c.id !== category?.id),
  );
  const nameError = visibleError(errors, 'name');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    markSubmitted();
    if (hasErrors(errors)) return;
    const payload = { name: values.name.trim(), type: values.type, color: values.color };
    const ok = await submit(() => (category ? updateCategory(category.id, payload) : addCategory(payload)));
    if (ok) {
      notify(category ? 'Категория обновлена' : 'Категория добавлена');
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogTitle>{category ? 'Редактирование категории' : 'Новая категория'}</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ pt: 1 }}>
          {serverError && <Alert severity="error">{serverError}</Alert>}
          <ToggleButtonGroup
            value={values.type}
            exclusive
            fullWidth
            disabled={!!category}
            size="small"
            sx={{ mb: 1 }}
            onChange={(_, v: TransactionType | null) => v && setValue('type', v)}
          >
            <ToggleButton value="expense">Расход</ToggleButton>
            <ToggleButton value="income">Доход</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="Название"
            value={values.name}
            onChange={(e) => setValue('name', e.target.value)}
            onBlur={() => touch('name')}
            error={!!nameError}
            helperText={nameError ?? ' '}
            autoFocus
            required
          />

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Цвет
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              {CATEGORY_COLORS.map((color) => (
                <ButtonBase
                  key={color}
                  aria-label={`Цвет ${color}`}
                  aria-pressed={values.color === color}
                  onClick={() => setValue('color', color)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: color,
                    color: '#fff',
                    outline: values.color === color ? '2px solid' : 'none',
                    outlineOffset: 2,
                    transition: 'transform 0.15s',
                    '&:hover': { transform: 'scale(1.1)' },
                  }}
                >
                  {values.color === color && <CheckIcon fontSize="small" />}
                </ButtonBase>
              ))}
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Отмена</Button>
        <Button type="submit" variant="contained" disableElevation disabled={submitting}>
          {category ? 'Сохранить' : 'Добавить'}
        </Button>
      </DialogActions>
    </form>
  );
}
