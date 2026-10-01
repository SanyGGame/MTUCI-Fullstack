import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.category import TransactionType
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.services.category_service import (
    create_category,
    delete_category,
    get_all_categories,
    get_category_by_id,
    update_category,
)

router = APIRouter(prefix="/categories", tags=["categories"])


async def _get_or_404(db: AsyncSession, category_id: uuid.UUID, user: User):
    category = await get_category_by_id(db, category_id, user.id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Категория {category_id} не найдена",
        )
    return category


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=list[CategoryResponse],
    summary="Получить список категорий",
    description="Возвращает все категории.",
)
async def list_categories(
    type: TransactionType | None = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await get_all_categories(db, user.id, type)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=CategoryResponse,
    summary="Создать категорию",
    description="Создаёт новую категорию доходов или расходов.",
    responses={409: {"description": "Такая категория уже существует."}},
)
async def create(
    body: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await create_category(db, user.id, body)


@router.get(
    "/{category_id}",
    status_code=status.HTTP_200_OK,
    response_model=CategoryResponse,
    summary="Получить категорию",
    description="Возвращает категорию по её идентификатору.",
    responses={404: {"description": "Категория не найдена."}},
)
async def get_category(
    category_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await _get_or_404(db, category_id, user)


@router.patch(
    "/{category_id}",
    status_code=status.HTTP_200_OK,
    response_model=CategoryResponse,
    summary="Изменить категорию",
    description="Частично обновляет категорию. Переданные поля заменяют текущие значения.",
    responses={
        404: {"description": "Категория не найдена."},
        409: {
            "description": "Такая категория уже существует либо у категории есть операции или бюджеты и менять тип нельзя."
        },
    },
)
async def update(
    category_id: uuid.UUID,
    body: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    category = await _get_or_404(db, category_id, user)
    return await update_category(db, category, body)


@router.delete(
    "/{category_id}",
    status_code=status.HTTP_200_OK,
    summary="Удалить категорию",
    description="Удаляет категорию вместе с её бюджетами. Категорию, к которой привязаны операции, удалить нельзя.",
    responses={
        404: {"description": "Категория не найдена."},
        409: {"description": "К категории привязаны операции."},
    },
)
async def delete(
    category_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    category = await _get_or_404(db, category_id, user)
    await delete_category(db, category)
    return {"id": category_id, "message": f"Категория '{category.name}' удалена"}
