import datetime as dt
import uuid

from app.services.transaction_service import (
    create_transaction,
    delete_transaction,
    get_all_transactions,
    get_transaction_by_id,
    update_transaction,
)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.category import TransactionType
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
    TransactionUpdate,
)

router = APIRouter(prefix="/transactions", tags=["transactions"])


async def _get_or_404(db: AsyncSession, transaction_id: uuid.UUID, user: User):
    transaction = await get_transaction_by_id(db, transaction_id, user.id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Операция {transaction_id} не найдена",
        )
    return transaction


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=list[TransactionResponse],
    summary="Получить список операций",
    description="Возвращает операции от новых к старым. Можно фильтровать по типу, категории и периоду дат.",
)
async def list_transactions(
    type: TransactionType | None = None,
    category_id: uuid.UUID | None = None,
    date_from: dt.date | None = None,
    date_to: dt.date | None = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await get_all_transactions(db, user.id, type, category_id, date_from, date_to)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=TransactionResponse,
    summary="Создать операцию",
    description="Создаёт доход или расход в выбранной категории.",
    responses={404: {"description": "Категория не найдена."}},
)
async def create(
    body: TransactionCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await create_transaction(db, user.id, body)


@router.get(
    "/{transaction_id}",
    status_code=status.HTTP_200_OK,
    response_model=TransactionResponse,
    summary="Получить операцию",
    description="Возвращает операцию по её идентификатору.",
    responses={404: {"description": "Операция не найдена."}},
)
async def get_transaction(
    transaction_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await _get_or_404(db, transaction_id, user)


@router.patch(
    "/{transaction_id}",
    status_code=status.HTTP_200_OK,
    response_model=TransactionResponse,
    summary="Изменить операцию",
    description="Частично обновляет операцию. Переданные поля заменяют текущие значения.",
    responses={404: {"description": "Операция или новая категория не найдена."}},
)
async def update(
    transaction_id: uuid.UUID,
    body: TransactionUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    transaction = await _get_or_404(db, transaction_id, user)
    return await update_transaction(db, user.id, transaction, body)


@router.delete(
    "/{transaction_id}",
    status_code=status.HTTP_200_OK,
    summary="Удалить операцию",
    description="Удаляет операцию.",
    responses={404: {"description": "Операция не найдена."}},
)
async def delete(
    transaction_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    transaction = await _get_or_404(db, transaction_id, user)
    await delete_transaction(db, transaction)
    return {"id": transaction_id, "message": "Операция удалена"}
