import datetime as dt
from decimal import Decimal
from uuid import UUID

from app.schemas.category import CategoryResponse
from pydantic import BaseModel, Field

from app.models.category import TransactionType


class TransactionCreate(BaseModel):
    date: dt.date
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    category_id: UUID
    description: str = Field(default="", max_length=255)

    model_config = {"str_strip_whitespace": True}


class TransactionUpdate(BaseModel):
    date: dt.date | None = None
    amount: Decimal | None = Field(default=None, gt=0, max_digits=12, decimal_places=2)
    category_id: UUID | None = None
    description: str | None = Field(default=None, max_length=255)

    model_config = {"str_strip_whitespace": True}


class TransactionResponse(BaseModel):
    id: UUID
    date: dt.date
    amount: Decimal
    type: TransactionType
    description: str
    category_id: UUID
    category: CategoryResponse

    model_config = {"from_attributes": True}
