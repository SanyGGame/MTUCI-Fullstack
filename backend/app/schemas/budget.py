import datetime as dt
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field, field_validator

from app.schemas.category import CategoryResponse


class BudgetCreate(BaseModel):
    category_id: UUID
    month: dt.date
    monthly_limit: Decimal = Field(gt=0, max_digits=12, decimal_places=2)

    @field_validator("month")
    @classmethod
    def month_first_day(cls, v: dt.date) -> dt.date:
        return v.replace(day=1)


class BudgetUpdate(BaseModel):
    monthly_limit: Decimal = Field(gt=0, max_digits=12, decimal_places=2)


class BudgetResponse(BaseModel):
    id: UUID
    category_id: UUID
    month: dt.date
    monthly_limit: Decimal
    spent: Decimal
    category: CategoryResponse

    model_config = {"from_attributes": True}
