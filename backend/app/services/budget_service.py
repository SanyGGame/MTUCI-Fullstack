import datetime as dt
import uuid
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.budget import Budget
from app.models.category import Category, TransactionType
from app.models.transaction import Transaction
from app.schemas.budget import BudgetCreate, BudgetUpdate
from app.services.category_service import get_category_by_id


def _next_month(month: dt.date) -> dt.date:
    return (month.replace(day=28) + dt.timedelta(days=4)).replace(day=1)


async def _attach_spent(db: AsyncSession, budget: Budget) -> Budget:
    result = await db.execute(
        select(func.coalesce(func.sum(Transaction.amount), 0)).where(
            Transaction.category_id == budget.category_id,
            Transaction.date >= budget.month,
            Transaction.date < _next_month(budget.month),
        )
    )
    budget.spent = Decimal(result.scalar_one())
    return budget


async def get_all_budgets(
    db: AsyncSession, user_id: uuid.UUID, month: dt.date | None = None
) -> list[Budget]:
    query = (
        select(Budget)
        .join(Budget.category)
        .where(Category.user_id == user_id)
        .order_by(Budget.month.desc(), Budget.id)
    )
    if month:
        query = query.where(Budget.month == month.replace(day=1))

    result = await db.execute(query)
    return [await _attach_spent(db, b) for b in result.scalars().all()]


async def get_budget_by_id(
    db: AsyncSession, budget_id: uuid.UUID, user_id: uuid.UUID
) -> Budget | None:
    budget = await db.get(Budget, budget_id)
    if budget is None or budget.category.user_id != user_id:
        return None
    return await _attach_spent(db, budget)


async def create_budget(db: AsyncSession, user_id: uuid.UUID, data: BudgetCreate) -> Budget:
    category = await get_category_by_id(db, data.category_id, user_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Категория {data.category_id} не найдена",
        )
    if category.type != TransactionType.expense:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Бюджет можно задать только для категории расходов",
        )

    result = await db.execute(
        select(Budget.id).where(
            Budget.category_id == data.category_id, Budget.month == data.month
        )
    )
    if result.first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Бюджет для категории «{category.name}» на {data.month:%Y-%m} уже существует",
        )

    budget = Budget(**data.model_dump())
    db.add(budget)
    await db.commit()
    await db.refresh(budget)
    return await _attach_spent(db, budget)


async def update_budget(db: AsyncSession, budget: Budget, data: BudgetUpdate) -> Budget:
    budget.monthly_limit = data.monthly_limit
    await db.commit()
    await db.refresh(budget)
    return await _attach_spent(db, budget)


async def delete_budget(db: AsyncSession, budget: Budget) -> None:
    await db.delete(budget)
    await db.commit()
