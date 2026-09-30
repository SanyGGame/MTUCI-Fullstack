from uuid import UUID

from pydantic import BaseModel, Field

from app.models.category import TransactionType

HEX_COLOR = r"^#[0-9A-Fa-f]{6}$"


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    type: TransactionType
    color: str = Field(default="#8A8577", pattern=HEX_COLOR)
    icon: str | None = Field(default=None, max_length=50)

    model_config = {"str_strip_whitespace": True}


class CategoryUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    type: TransactionType | None = None
    color: str | None = Field(default=None, pattern=HEX_COLOR)
    icon: str | None = Field(default=None, max_length=50)

    model_config = {"str_strip_whitespace": True}


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    type: TransactionType
    color: str
    icon: str | None = None

    model_config = {"from_attributes": True}
