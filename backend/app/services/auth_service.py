import datetime as dt

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import (
    create_access_token,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    verify_password,
)
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.schemas.auth import TokenPair, UserCreate


def _unauthorized(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


async def register_user(db: AsyncSession, data: UserCreate) -> User:
    email = data.email.lower()
    result = await db.execute(select(User.id).where(User.email == email))
    conflict = HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Пользователь с таким email уже зарегистрирован",
    )
    if result.first():
        raise conflict

    user = User(email=email, password_hash=hash_password(data.password))
    db.add(user)
    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise conflict
    await db.refresh(user)
    return user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User:
    result = await db.execute(select(User).where(User.email == email.strip().lower()))
    user = result.scalar_one_or_none()
    if user is None or not verify_password(password, user.password_hash):
        raise _unauthorized("Неверный email или пароль")
    return user


async def issue_tokens(db: AsyncSession, user: User) -> TokenPair:
    refresh_token = generate_refresh_token()
    db.add(
        RefreshToken(
            user_id=user.id,
            token_hash=hash_refresh_token(refresh_token),
            expires_at=dt.datetime.now(dt.timezone.utc)
            + dt.timedelta(days=settings.refresh_token_expire_days),
        )
    )
    await db.commit()
    return TokenPair(access_token=create_access_token(user.id), refresh_token=refresh_token)


async def _find_refresh_token(db: AsyncSession, raw_token: str) -> RefreshToken | None:
    result = await db.execute(
        select(RefreshToken).where(RefreshToken.token_hash == hash_refresh_token(raw_token))
    )
    return result.scalar_one_or_none()


async def refresh_access_token(db: AsyncSession, raw_token: str) -> str:
    token = await _find_refresh_token(db, raw_token)
    if token is None:
        raise _unauthorized("Некорректный refresh token")
    if token.revoked:
        raise _unauthorized("Refresh token отозван")
    if token.expires_at <= dt.datetime.now(dt.timezone.utc):
        raise _unauthorized("Срок действия refresh token истёк")
    return create_access_token(token.user_id)


async def revoke_refresh_token(db: AsyncSession, raw_token: str) -> None:
    token = await _find_refresh_token(db, raw_token)
    if token is not None and not token.revoked:
        token.revoked = True
        await db.commit()
