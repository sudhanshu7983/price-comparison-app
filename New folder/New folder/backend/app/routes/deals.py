from fastapi import APIRouter, HTTPException, Query

from app.schemas.deal import DealSearchResponse
from app.services.deal_service import search_deals
from app.services.payment_service import get_best_payment_option

router = APIRouter(
    prefix="/deals",
    tags=["Deals"]
)


@router.get("/search", response_model=DealSearchResponse)
def search(
    q: str = Query(..., min_length=1, max_length=200)
):
    query = q.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Please enter what you want to buy."
        )

    deals = search_deals(query)
    best_payment = get_best_payment_option(deals)

    return DealSearchResponse(
        query=query,
        deals=deals,
        cheapest_deal=deals[0] if deals else None,
        best_payment=best_payment
    )