from app.routes.products import router as products_router
from app.routes.stores import router as stores_router
from app.routes.prices import router as prices_router
from app.routes.auth import router as auth_router
from app.routes.deals import router as deals_router
from app.routes.comparisons import router as comparisons_router
from app.routes.auth import get_current_user
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

protected_dependencies = [Depends(get_current_user)]

app.include_router(products_router, dependencies=protected_dependencies)
app.include_router(stores_router, dependencies=protected_dependencies)
app.include_router(prices_router, dependencies=protected_dependencies)
app.include_router(auth_router)
app.include_router(deals_router, dependencies=protected_dependencies)
app.include_router(comparisons_router, dependencies=protected_dependencies)

@app.get("/")
def root():
    return {
        "message": "Price Comparison API is running"
    } 