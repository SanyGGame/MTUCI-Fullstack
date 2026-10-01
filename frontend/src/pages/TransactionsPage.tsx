import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { alpha } from '@mui/material/styles';
import { mockTransactions } from '../api/mockTransactions';
import { getCategoryById } from '../api/mockCategories';
import Money from '../shared/ui/Money';
import type { TransactionType } from '../types';

type Filter = 'all' | TransactionType;

export default function TransactionsPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const rows = useMemo(() => {
    const sorted = [...mockTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    if (filter === 'all') return sorted;
    return sorted.filter((t) => t.type === filter);
  }, [filter]);

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
            Транзакции
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {rows.length} операций
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} disableElevation>
          Добавить операцию
        </Button>
      </Box>

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_, value) => value && setFilter(value)}
        size="small"
        sx={{ mb: 3 }}
      >
        <ToggleButton value="all">Все</ToggleButton>
        <ToggleButton value="income">Доходы</ToggleButton>
        <ToggleButton value="expense">Расходы</ToggleButton>
      </ToggleButtonGroup>

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell align="right">Сумма</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  Транзакций не найдено
                </TableCell>
              </TableRow>
            ) : (
              rows.map((t) => {
                const cat = getCategoryById(t.categoryId);
                return (
                  <TableRow key={t.id} hover>
                    <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      {new Date(t.date).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={cat?.name}
                        size="small"
                        sx={{
                          bgcolor: cat?.color ? alpha(cat.color, 0.1) : 'action.hover',
                          color: cat?.color,
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Money amount={t.amount} type={t.type} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
