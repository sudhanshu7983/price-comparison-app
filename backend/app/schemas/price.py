from datetime import datetime

from pydantic import BaseModel


class PriceCreate(BaseModel):
    product_id: int
    store_id: int
    price: float
    original_price: float | None = None
    currency: str = "INR"
    product_url: str
    availability: str = "In Stock"


class PriceResponse(BaseModel):
    id: int
    product_id: int
    store_id: int
    price: float
    original_price: float | None
    currency: str
    product_url: str
    availability: str
    fetched_at: datetime

    class Config:
        from_attributes = True