from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.price import Price
from app.models.product import Product
from app.models.store import Store
from app.schemas.price import PriceCreate, PriceResponse
from app.models.price_history import PriceHistory
from app.schemas.price_update import PriceUpdate

router = APIRouter(
    prefix="/prices",
    tags=["Prices"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=PriceResponse)
def create_price(
    price: PriceCreate,
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .filter(Product.id == price.product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    store = (
        db.query(Store)
        .filter(Store.id == price.store_id)
        .first()
    )

    if not store:
        raise HTTPException(
            status_code=404,
            detail="Store not found"
        )

    new_price = Price(
        product_id=price.product_id,
        store_id=price.store_id,
        price=price.price,
        original_price=price.original_price,
        currency=price.currency,
        product_url=price.product_url,
        availability=price.availability
    )

    db.add(new_price)
    db.commit()
    db.refresh(new_price)

    return new_price


@router.get("/", response_model=list[PriceResponse])
def get_prices(db: Session = Depends(get_db)):
    return db.query(Price).all()

@router.put("/{price_id}", response_model=PriceResponse)
def update_price(
    price_id: int,
    price_update: PriceUpdate,
    db: Session = Depends(get_db)
):
    existing_price = (
        db.query(Price)
        .filter(Price.id == price_id)
        .first()
    )

    if not existing_price:
        raise HTTPException(
            status_code=404,
            detail="Price not found"
        )

    history_entry = PriceHistory(
        price_id=existing_price.id,
        price=existing_price.price
    )

    db.add(history_entry)

    existing_price.price = price_update.price
    existing_price.original_price = price_update.original_price
    existing_price.availability = price_update.availability

    db.commit()
    db.refresh(existing_price)

    return existing_price 