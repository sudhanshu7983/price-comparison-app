from app.schemas.deal import Deal


def search_deals(query: str) -> list[Deal]:
    query = query.strip()

    if not query:
        return []

    sources = [
        {
            "store_name": "Amazon",
            "price": 1050.0,
            "original_price": 1150.0,
            "product_url": "https://www.amazon.in/",
        },
        {
            "store_name": "Flipkart",
            "price": 996.0,
            "original_price": 1099.0,
            "product_url": "https://www.flipkart.com/",
        },
        {
            "store_name": "Blinkit",
            "price": 1020.0,
            "original_price": 1100.0,
            "product_url": "https://blinkit.com/",
        },
        {
            "store_name": "Zepto",
            "price": 1010.0,
            "original_price": 1080.0,
            "product_url": "https://www.zepto.com/",
        },
    ]

    deals = []

    for source in sources:
        deals.append(
            Deal(
                store_name=source["store_name"],
                product_name=query.title(),
                price=source["price"],
                original_price=source["original_price"],
                currency="INR",
                product_url=source["product_url"],
                availability="In Stock",
            )
        )

    deals.sort(key=lambda deal: deal.price)

    if deals:
        deals[0].is_cheapest = True

    return deals  