from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import (
    AccessToken,
    RefreshRequest,
    TokenPair,
    UserCreate,
    UserLogin,
    UserResponse,
)
from app.services.auth_service import (
    authenticate_user,
    issue_tokens,
    refresh_access_token,
    register_user,
    revoke_refresh_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=UserResponse,
    summary="Регистрация",
    description="Создаёт пользователя. Хранится в виде хеша Argon2.",
    responses={409: {"description": "Email уже зарегистрирован."}},
)
async def register(body: UserCreate, db: AsyncSession = Depends(get_db)):
    return await register_user(db, body)


@router.post(
    "/login",
    response_model=TokenPair,
    summary="Вход",
    description="Проверяет email и пароль, выдаёт access token (JWT) и refresh token.",
    responses={401: {"description": "Неверный email или пароль."}},
)
async def login(body: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(db, body.email, body.password)
    return await issue_tokens(db, user)


@router.post(
    "/refresh",
    response_model=AccessToken,
    summary="Обновить access token",
    description="Выдаёт новый access token по действующему refresh token.",
    responses={401: {"description": "Refresh token некорректен, истёк или отозван."}},
)
async def refresh(body: RefreshRequest, db: AsyncSession = Depends(get_db)):
    return AccessToken(access_token=await refresh_access_token(db, body.refresh_token))


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Выход",
    description="Отзывает refresh token текущей сессии.",
)
async def logout(body: RefreshRequest, db: AsyncSession = Depends(get_db)):
    await revoke_refresh_token(db, body.refresh_token)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Текущий пользователь",
    responses={401: {"description": "Нет действительного access token."}},
)
async def me(user: User = Depends(get_current_user)):
    return user
