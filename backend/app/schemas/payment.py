from pydantic import BaseModel


class PaymentOption(BaseModel):
    store_name: str
    card_name: str
    original_price: float
    reward_rate: float
    savings: float
    effective_price: float
    currency: str = "INR"


class BestPaymentResponse(BaseModel):
    recommendation: PaymentOption | None
