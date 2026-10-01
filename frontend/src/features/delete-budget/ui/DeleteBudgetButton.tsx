import { useFinance } from '../../../entities/finance';
import ConfirmDeleteButton from '../../../shared/ui/ConfirmDeleteButton';

export default function DeleteBudgetButton({ budgetId, name }: { budgetId: string; name: string }) {
  const { deleteBudget } = useFinance();

  return (
    <ConfirmDeleteButton
      ariaLabel="Удалить бюджет"
      title="Удалить бюджет?"
      text={`Бюджет для категории «${name}» будет удалён.`}
      successMessage="Бюджет удалён"
      onConfirm={() => deleteBudget(budgetId)}
    />
  );
}
