from fastapi import FastAPI

from app.routes.products import router as products_router
from app.routes.stores import router as stores_router
from app.routes.prices import router as prices_router
from app.routes.auth import router as auth_router
from app.routes.deals import router as deals_router
from app.routes.comparisons import router as comparisons_router

app = FastAPI()


app.include_router(products_router)
app.include_router(stores_router)
app.include_router(prices_router)
app.include_router(auth_router)
app.include_router(deals_router)
app.include_router(comparisons_router)

@app.get("/")
def root():
    return {
        "message": "Price Comparison API is running"
    }