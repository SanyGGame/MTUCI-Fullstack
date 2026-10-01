import { useState } from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useFinance } from '../../../entities/finance';
import AppDialog from '../../../shared/ui/AppDialog';
import { useNotify } from '../../../shared/ui/useNotify';

interface Props {
  transactionId: string;
  description: string;
}

export default function DeleteTransactionButton({ transactionId, description }: Props) {
  const [open, setOpen] = useState(false);
  const { deleteTransaction } = useFinance();
  const notify = useNotify();

  const handleConfirm = () => {
    deleteTransaction(transactionId);
    notify('Операция удалена');
    setOpen(false);
  };

  return (
    <>
      <IconButton size="small" aria-label="Удалить операцию" onClick={() => setOpen(true)}>
        <DeleteOutlinedIcon fontSize="small" />
      </IconButton>
      <AppDialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Удалить операцию?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {description ? `«${description}» будет удалена` : 'Операция будет удалена'} без возможности
            восстановления.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button color="error" variant="contained" disableElevation onClick={handleConfirm}>
            Удалить
          </Button>
        </DialogActions>
      </AppDialog>
    </>
  );
}
