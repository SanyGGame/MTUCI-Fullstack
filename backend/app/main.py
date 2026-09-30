from contextlib import asynccontextmanager

from app.core.database import close_db, init_db
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(title="Личный финучёт API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Проверка состояния системы",
    description="Возвращает статус 'ok' для проверки работоспособности сервиса.",
)
async def health_check():
    return {"status": "ok"}
