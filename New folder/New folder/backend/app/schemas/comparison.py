from pydantic import BaseModel


class ComparisonPrice(BaseModel):
    store_id: int
    store_name: str
    price: float
    original_price: float | None
    currency: str
    product_url: str
    availability: str


class BestDeal(BaseModel):
    store_id: int
    store_name: str
    price: float
    currency: str
    product_url: str


class ProductComparisonResponse(BaseModel):
    product_id: int
    product_name: str
    prices: list[ComparisonPrice]
    best_deal: BestDeal | None
    