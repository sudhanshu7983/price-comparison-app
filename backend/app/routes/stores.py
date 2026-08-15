from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.store import Store
from app.schemas.store import StoreCreate, StoreResponse


router = APIRouter(
    prefix="/stores",
    tags=["Stores"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=StoreResponse)
def create_store(
    store: StoreCreate,
    db: Session = Depends(get_db)
):
    existing_store = (
        db.query(Store)
        .filter(Store.name == store.name)
        .first()
    )

    if existing_store:
        raise HTTPException(
            status_code=400,
            detail="Store already exists"
        )

    new_store = Store(
        name=store.name,
        website_url=store.website_url
    )

    db.add(new_store)
    db.commit()
    db.refresh(new_store)

    return new_store


@router.get("/", response_model=list[StoreResponse])
def get_stores(db: Session = Depends(get_db)):
    return db.query(Store).all()


@router.get("/{store_id}", response_model=StoreResponse)
def get_store(
    store_id: int,
    db: Session = Depends(get_db)
):
    store = (
        db.query(Store)
        .filter(Store.id == store_id)
        .first()
    )

    if not store:
        raise HTTPException(
            status_code=404,
            detail="Store not found"
        )

    return store