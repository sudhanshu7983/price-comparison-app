from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductResponse
from app.schemas.comparison import (
    ComparisonPrice,
    BestDeal,
    ProductComparisonResponse
)


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    new_product = Product(
        name=product.name,
        description=product.description
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()


@router.get("/search", response_model=list[ProductResponse])
def search_products(
    q: str,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    if not q.strip():
        return []

    limit = min(limit, 50)

    products = (
        db.query(Product)
        .filter(Product.name.ilike(f"%{q.strip()}%"))
        .limit(limit)
        .all()
    )

    return products


@router.get(
    "/{product_id}/compare",
    response_model=ProductComparisonResponse
)
def compare_product_prices(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    comparison_prices = []

    for price in product.prices:
        comparison_prices.append(
            ComparisonPrice(
                store_id=price.store_id,
                store_name=price.store.name,
                price=float(price.price),
                original_price=(
                    float(price.original_price)
                    if price.original_price is not None
                    else None
                ),
                currency=price.currency,
                product_url=price.product_url,
                availability=price.availability
            )
        )

    comparison_prices.sort(key=lambda item: item.price)

    best_deal = None

    if comparison_prices:
        cheapest = comparison_prices[0]

        best_deal = BestDeal(
            store_id=cheapest.store_id,
            store_name=cheapest.store_name,
            price=cheapest.price,
            currency=cheapest.currency,
            product_url=cheapest.product_url
        )

    return ProductComparisonResponse(
        product_id=product.id,
        product_name=product.name,
        prices=comparison_prices,
        best_deal=best_deal
    )