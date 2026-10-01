from contextlib import asynccontextmanager

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.transactions import router as transactions_router
from app.api.categories import router as categories_router
from app.api.budgets import router as budgets_router
from app.core.database import close_db, init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(title="Личный финучёт API", version="0.4.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(categories_router, prefix="/api/v1")
app.include_router(transactions_router, prefix="/api/v1")
app.include_router(budgets_router, prefix="/api/v1")


@app.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Проверка состояния системы",
    description="Возвращает статус 'ok' для проверки работоспособности сервиса.",
)
async def health_check():
    return {"status": "ok"}
