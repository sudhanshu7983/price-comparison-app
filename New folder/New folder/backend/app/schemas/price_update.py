from pydantic import BaseModel


class PriceUpdate(BaseModel):
    price: float
    original_price: float | None = None
    availability: str = "In Stock"