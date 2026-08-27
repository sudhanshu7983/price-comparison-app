# Price Comparison App

A full-stack web application that helps users search for products and compare prices from different sources.

## Features

* Search products
* Compare prices
* Find the lowest price
* View deal details
* Save comparisons
* Responsive UI

## Tech Stack

**Frontend:** React, TypeScript, Vite, CSS

**Backend:** Python, FastAPI, SQLAlchemy, Pydantic

**Database:** PostgreSQL

## Project Structure

```text
price-comparison-app/
├── frontend/
├── backend/
├── README.md
└── package.json
```

## Run the Project

Install the dependencies first, then from the project root run:

```bash
npm run dev:all
```

This single command runs both the **frontend and backend together** using `concurrently`.

* Frontend: `http://localhost:5173`
* Backend: `http://127.0.0.1:8000`


## Application Flow

```text
User → React Frontend → FastAPI → Database
                         ↓
                    Price Results
```

## Author

**Sudhanshu Pathak**
