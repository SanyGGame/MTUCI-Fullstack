import { useFinance } from '../../../entities/finance';
import ConfirmDeleteButton from '../../../shared/ui/ConfirmDeleteButton';

export default function DeleteCategoryButton({ categoryId, name }: { categoryId: string; name: string }) {
  const { deleteCategory } = useFinance();

  return (
    <ConfirmDeleteButton
      ariaLabel="Удалить категорию"
      title="Удалить категорию?"
      text={`Категория «${name}» и её бюджеты будут удалены. Если к категории привязаны операции, удаление невозможно.`}
      successMessage="Категория удалена"
      onConfirm={() => deleteCategory(categoryId)}
    />
  );
}
