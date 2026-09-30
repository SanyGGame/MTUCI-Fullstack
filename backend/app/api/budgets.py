import datetime as dt
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.budget import BudgetCreate, BudgetResponse, BudgetUpdate
from app.services.budget_service import (
    create_budget,
    delete_budget,
    get_all_budgets,
    get_budget_by_id,
    update_budget,
)

router = APIRouter(prefix="/budgets", tags=["budgets"])


async def _get_or_404(db: AsyncSession, budget_id: uuid.UUID):
    budget = await get_budget_by_id(db, budget_id)
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Бюджет {budget_id} не найден",
        )
    return budget


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=list[BudgetResponse],
    summary="Получить список бюджетов",
    description="Возвращает бюджеты с расчётом потраченной суммы. Можно отфильтровать по месяцу.",
)
async def list_budgets(
    month: dt.date | None = None, db: AsyncSession = Depends(get_db)
):
    return await get_all_budgets(db, month)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=BudgetResponse,
    summary="Создать бюджет",
    description="Задаёт месячный лимит расходов для категории. Дата приводится к первому числу месяца.",
    responses={
        404: {"description": "Категория не найдена."},
        409: {"description": "Бюджет для этой категории и месяца уже существует."},
        422: {"description": "Бюджет можно задать только для категории расходов."},
    },
)
async def create(body: BudgetCreate, db: AsyncSession = Depends(get_db)):
    return await create_budget(db, body)


@router.get(
    "/{budget_id}",
    status_code=status.HTTP_200_OK,
    response_model=BudgetResponse,
    summary="Получить бюджет",
    description="Возвращает бюджет по его идентификатору.",
    responses={404: {"description": "Бюджет не найден."}},
)
async def get_budget(budget_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    return await _get_or_404(db, budget_id)


@router.patch(
    "/{budget_id}",
    status_code=status.HTTP_200_OK,
    response_model=BudgetResponse,
    summary="Изменить лимит бюджета",
    description="Обновляет месячный лимит бюджета.",
    responses={404: {"description": "Бюджет не найден."}},
)
async def update(
    budget_id: uuid.UUID, body: BudgetUpdate, db: AsyncSession = Depends(get_db)
):
    budget = await _get_or_404(db, budget_id)
    return await update_budget(db, budget, body)


@router.delete(
    "/{budget_id}",
    status_code=status.HTTP_200_OK,
    summary="Удалить бюджет",
    description="Удаляет бюджет.",
    responses={404: {"description": "Бюджет не найден."}},
)
async def delete(budget_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    budget = await _get_or_404(db, budget_id)
    await delete_budget(db, budget)
    return {"id": budget_id, "message": "Бюджет удалён"}
