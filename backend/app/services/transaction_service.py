import datetime as dt
import uuid

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category, TransactionType
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionUpdate
from app.services.category_service import get_category_by_id


async def _ensure_category_exists(
    db: AsyncSession, category_id: uuid.UUID, user_id: uuid.UUID
) -> None:
    if not await get_category_by_id(db, category_id, user_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Категория {category_id} не найдена",
        )


async def get_all_transactions(
    db: AsyncSession,
    user_id: uuid.UUID,
    type_: TransactionType | None = None,
    category_id: uuid.UUID | None = None,
    date_from: dt.date | None = None,
    date_to: dt.date | None = None,
) -> list[Transaction]:
    query = select(Transaction).join(Transaction.category).where(Category.user_id == user_id)

    if type_:
        query = query.where(Category.type == type_)
    if category_id:
        query = query.where(Transaction.category_id == category_id)
    if date_from:
        query = query.where(Transaction.date >= date_from)
    if date_to:
        query = query.where(Transaction.date <= date_to)

    result = await db.execute(query.order_by(Transaction.date.desc(), Transaction.id))
    return list(result.scalars().all())


async def get_transaction_by_id(
    db: AsyncSession, transaction_id: uuid.UUID, user_id: uuid.UUID
) -> Transaction | None:
    transaction = await db.get(Transaction, transaction_id)
    if transaction is None or transaction.category.user_id != user_id:
        return None
    return transaction


async def create_transaction(
    db: AsyncSession, user_id: uuid.UUID, data: TransactionCreate
) -> Transaction:
    await _ensure_category_exists(db, data.category_id, user_id)

    transaction = Transaction(**data.model_dump())
    db.add(transaction)
    await db.commit()
    await db.refresh(transaction)
    return transaction


async def update_transaction(
    db: AsyncSession, user_id: uuid.UUID, transaction: Transaction, data: TransactionUpdate
) -> Transaction:
    changes = data.model_dump(exclude_none=True)

    if "category_id" in changes:
        await _ensure_category_exists(db, changes["category_id"], user_id)

    for field, value in changes.items():
        setattr(transaction, field, value)
    await db.commit()
    await db.refresh(transaction)
    return transaction


async def delete_transaction(db: AsyncSession, transaction: Transaction) -> None:
    await db.delete(transaction)
    await db.commit()
