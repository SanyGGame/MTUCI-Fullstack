import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { alpha } from '@mui/material/styles';
import type { TransactionType } from '../entities/category';
import type { Transaction } from '../entities/transaction';
import { findCategory, sortByDateDesc, useFinance } from '../entities/finance';
import { AddTransactionDialog } from '../features/add-transaction';
import { DeleteTransactionButton } from '../features/delete-transaction';
import { formatDate } from '../shared/lib/format';
import DataState from '../shared/ui/DataState';
import Money from '../shared/ui/Money';
import PageHeader from '../shared/ui/PageHeader';

type Filter = 'all' | TransactionType;

export default function TransactionsPage() {
  const { status, error, reload, transactions, categories } = useFinance();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | undefined>();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortByDateDesc(transactions).filter(
      (t) =>
        (filter === 'all' || t.type === filter) &&
        (!q || t.description.toLowerCase().includes(q)),
    );
  }, [transactions, filter, query]);

  const addButton = (
    <Button variant="contained" startIcon={<AddIcon />} disableElevation onClick={() => {
        setEditing(undefined);
        setDialogOpen(true);
      }}
    >
      Добавить операцию
    </Button>
  );

  return (
    <Box>
      <PageHeader title="Транзакции" subtitle={`${rows.length} операций`} action={addButton} />

      <DataState
        status={status}
        error={error}
        onRetry={reload}
        isEmpty={transactions.length === 0}
        emptyTitle="Операций пока нет"
        emptyHint="Добавьте первый доход или расход"
        emptyAction={addButton}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(_, value: Filter | null) => value && setFilter(value)}
            size="small"
          >
            <ToggleButton value="all">Все</ToggleButton>
            <ToggleButton value="income">Доходы</ToggleButton>
            <ToggleButton value="expense">Расходы</ToggleButton>
          </ToggleButtonGroup>
          <TextField
            size="small"
            placeholder="Поиск по описанию"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: 240 }}
          />
        </Stack>

        <TableContainer component={Paper} variant="outlined">
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Дата</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell align="right">Сумма</TableCell>
                <TableCell align="right" sx={{ width: 96 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Ничего не найдено. Измените фильтр или поисковый запрос.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((t) => {
                  const cat = findCategory(categories, t.categoryId);
                  return (
                    <TableRow key={t.id} hover>
                      <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                        {formatDate(t.date)}
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
                      <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                        <IconButton
                          size="small"
                          aria-label="Изменить операцию"
                          onClick={() => {
                            setEditing(t);
                            setDialogOpen(true);
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <DeleteTransactionButton transactionId={t.id} description={t.description} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DataState>

      <AddTransactionDialog open={dialogOpen} transaction={editing} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
