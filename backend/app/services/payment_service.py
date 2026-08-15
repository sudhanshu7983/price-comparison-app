from app.schemas.deal import Deal, PaymentRecommendation


SEEDED_CARDS = [
    {
        "store_name": "Amazon",
        "card_name": "Amazon Pay ICICI Card",
        "reward_rate": 5.0,
    },
    {
        "store_name": "Flipkart",
        "card_name": "HDFC Millennia Card",
        "reward_rate": 5.0,
    },
    {
        "store_name": "Blinkit",
        "card_name": "SBI Cashback Card",
        "reward_rate": 5.0,
    },
    {
        "store_name": "Zepto",
        "card_name": "Axis Ace Card",
        "reward_rate": 4.0,
    },
]


def get_best_payment_option(
    deals: list[Deal],
) -> PaymentRecommendation | None:

    options = []

    for deal in deals:
        for card in SEEDED_CARDS:

            if card["store_name"] != deal.store_name:
                continue

            savings = deal.price * (
                card["reward_rate"] / 100
            )

            effective_price = deal.price - savings

            options.append(
                PaymentRecommendation(
                    store_name=deal.store_name,
                    card_name=card["card_name"],
                    original_price=deal.price,
                    reward_rate=card["reward_rate"],
                    savings=round(savings, 2),
                    effective_price=round(effective_price, 2),
                    currency=deal.currency,
                )
            )

    if not options:
        return None

    return min(
        options,
        key=lambda option: option.effective_price
    )