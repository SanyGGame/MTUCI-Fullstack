import { useFinance } from '../../../entities/finance';
import ConfirmDeleteButton from '../../../shared/ui/ConfirmDeleteButton';

interface Props {
  transactionId: string;
  description: string;
}

export default function DeleteTransactionButton({ transactionId, description }: Props) {
  const { deleteTransaction } = useFinance();

  return (
    <ConfirmDeleteButton
      ariaLabel="Удалить операцию"
      title="Удалить операцию?"
      text={`${description ? `«${description}» будет удалена` : 'Операция будет удалена'} без возможности восстановления.`}
      successMessage="Операция удалена"
      onConfirm={() => deleteTransaction(transactionId)}
    />
  );
}
