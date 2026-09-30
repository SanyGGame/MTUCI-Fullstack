import datetime as dt
import uuid
from decimal import Decimal

from sqlalchemy import CheckConstraint, Date, ForeignKey, Numeric, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.category import Category


class Budget(Base):
    __tablename__ = "budgets"
    __table_args__ = (
        UniqueConstraint("category_id", "month", name="uq_budget_category_month"),
        CheckConstraint("monthly_limit > 0", name="ck_budget_limit_positive"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("categories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    month: Mapped[dt.date] = mapped_column(
        Date,
        nullable=False,
    )
    monthly_limit: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    category: Mapped[Category] = relationship("Category", lazy="joined")
