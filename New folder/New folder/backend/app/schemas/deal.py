from pydantic import BaseModel


class Deal(BaseModel):
    store_name: str
    product_name: str
    price: float
    original_price: float | None = None
    currency: str = "INR"
    product_url: str
    availability: str = "In Stock"
    is_cheapest: bool = False

class PaymentRecommendation(BaseModel):
    store_name: str
    card_name: str
    original_price: float
    reward_rate: float
    savings: float
    effective_price: float
    currency: str = "INR"

class DealSearchResponse(BaseModel):
    query: str
    deals: list[Deal]
    cheapest_deal: Deal | None
    best_payment: PaymentRecommendation | None