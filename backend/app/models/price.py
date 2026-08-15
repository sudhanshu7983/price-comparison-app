from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Price(Base):
    __tablename__ = "prices"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"),
        nullable=False
    )

    store_id: Mapped[int] = mapped_column(
        ForeignKey("stores.id"),
        nullable=False
    )

    price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )

    original_price: Mapped[float | None] = mapped_column(
        Numeric(10, 2),
        nullable=True
    )

    currency: Mapped[str] = mapped_column(
        String(3),
        default="INR",
        nullable=False
    )

    product_url: Mapped[str] = mapped_column(
        String(1000),
        nullable=False
    )

    availability: Mapped[str] = mapped_column(
        String(50),
        default="In Stock",
        nullable=False
    )

    fetched_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    product: Mapped["Product"] = relationship(
        back_populates="prices"
    )

    store: Mapped["Store"] = relationship(
        back_populates="prices"
    )
    history = relationship(
    "PriceHistory",
    back_populates="price_record",
    cascade="all, delete-orphan"
)