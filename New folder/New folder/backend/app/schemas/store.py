from pydantic import BaseModel


class StoreCreate(BaseModel):
    name: str
    website_url: str


class StoreResponse(BaseModel):
    id: int
    name: str
    website_url: str

    class Config:
        from_attributes = True