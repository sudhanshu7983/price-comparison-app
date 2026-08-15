from datetime import datetime

from pydantic import BaseModel


class ComparisonCreate(BaseModel):
    query: str
    store_name: str
    product_name: str
    price: float
    effective_price: float | None = None
    card_name: str | None = None


class ComparisonResponse(BaseModel):
    id: int
    query: str
    store_name: str
    product_name: str
    price: float
    effective_price: float | None
    card_name: str | None
    created_at: datetime

    class Config:
        from_attributes = True