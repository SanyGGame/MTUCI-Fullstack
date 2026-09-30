import uuid

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.budget import Budget
from app.models.category import Category, TransactionType
from app.models.transaction import Transaction
from app.schemas.category import CategoryCreate, CategoryUpdate


async def get_all_categories(
    db: AsyncSession, type_: TransactionType | None = None
) -> list[Category]:
    query = select(Category).order_by(Category.type, Category.name)
    if type_:
        query = query.where(Category.type == type_)
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_category_by_id(db: AsyncSession, category_id: uuid.UUID) -> Category | None:
    return await db.get(Category, category_id)


async def _category_exists(
    db: AsyncSession, name: str, type_: TransactionType, exclude_id: uuid.UUID | None = None
) -> bool:
    query = select(Category.id).where(Category.name == name, Category.type == type_)
    if exclude_id:
        query = query.where(Category.id != exclude_id)
    result = await db.execute(query)
    return result.first() is not None


async def _count(db: AsyncSession, model, category_id: uuid.UUID) -> int:
    result = await db.execute(
        select(func.count()).select_from(model).where(model.category_id == category_id)
    )
    return result.scalar_one()


async def create_category(db: AsyncSession, data: CategoryCreate) -> Category:
    if await _category_exists(db, data.name, data.type):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Категория «{data.name}» ({data.type.value}) уже существует",
        )

    category = Category(**data.model_dump())
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


async def update_category(
    db: AsyncSession, category: Category, data: CategoryUpdate
) -> Category:
    changes = data.model_dump(exclude_none=True)
    new_name = changes.get("name", category.name)
    new_type = changes.get("type", category.type)

    if new_type != category.type:
        if await _count(db, Transaction, category.id) or await _count(db, Budget, category.id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Нельзя изменить тип категории, у которой есть операции или бюджеты",
            )

    if (new_name, new_type) != (category.name, category.type):
        if await _category_exists(db, new_name, new_type, exclude_id=category.id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Категория «{new_name}» ({new_type.value}) уже существует",
            )

    for field, value in changes.items():
        setattr(category, field, value)
    await db.commit()
    await db.refresh(category)
    return category


async def delete_category(db: AsyncSession, category: Category) -> None:
    used = await _count(db, Transaction, category.id)
    if used:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Нельзя удалить категорию: к ней привязано операций — {used}",
        )
    await db.delete(category)
    await db.commit()
