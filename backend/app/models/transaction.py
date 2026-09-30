import datetime as dt
import uuid
from decimal import Decimal

from sqlalchemy import CheckConstraint, Date, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.category import Category, TransactionType


class Transaction(Base):
    __tablename__ = "transactions"
    __table_args__ = (CheckConstraint("amount > 0", name="ck_transaction_amount_positive"),)

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    date: Mapped[dt.date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )
    amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )
    description: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="",
    )
    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("categories.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    category: Mapped[Category] = relationship("Category", lazy="joined")

    @property
    def type(self) -> TransactionType:
        return self.category.type
