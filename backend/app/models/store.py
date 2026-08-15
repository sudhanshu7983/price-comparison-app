from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Store(Base):
    __tablename__ = "stores"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )

    website_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )

    prices: Mapped[list["Price"]] = relationship(
        back_populates="store",
        cascade="all, delete-orphan"
    )