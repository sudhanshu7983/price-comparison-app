from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.comparison import Comparison
from app.models.user import User
from app.routes.auth import get_current_user
from app.schemas.comparison_save import (
    ComparisonCreate,
    ComparisonResponse,
)


router = APIRouter(
    prefix="/comparisons",
    tags=["Comparisons"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post(
    "/",
    response_model=ComparisonResponse,
    status_code=status.HTTP_201_CREATED
)
def save_comparison(
    data: ComparisonCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    comparison = Comparison(
        user_id=current_user.id,
        query=data.query,
        store_name=data.store_name,
        product_name=data.product_name,
        price=data.price,
        effective_price=data.effective_price,
        card_name=data.card_name,
    )

    db.add(comparison)
    db.commit()
    db.refresh(comparison)

    return comparison


@router.get(
    "/",
    response_model=list[ComparisonResponse]
)
def get_my_comparisons(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(Comparison)
        .filter(Comparison.user_id == current_user.id)
        .order_by(Comparison.created_at.desc())
        .all()
    )


@router.get(
    "/{comparison_id}",
    response_model=ComparisonResponse
)
def get_comparison(
    comparison_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    comparison = (
        db.query(Comparison)
        .filter(
            Comparison.id == comparison_id,
            Comparison.user_id == current_user.id
        )
        .first()
    )

    if not comparison:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comparison not found"
        )

    return comparison


@router.delete(
    "/{comparison_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_comparison(
    comparison_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    comparison = (
        db.query(Comparison)
        .filter(
            Comparison.id == comparison_id,
            Comparison.user_id == current_user.id
        )
        .first()
    )

    if not comparison:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comparison not found"
        )

    db.delete(comparison)
    db.commit()

    return None  