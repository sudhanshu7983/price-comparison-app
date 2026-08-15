# Price Comparison App

A full-stack price comparison application that lets users search for products, compare deals from different sources, and find the most suitable price and payment option.

## Features

* Product search
* Compare prices from multiple sources
* Highlight the lowest available price
* View deal details
* Best way to pay section
* Save comparisons
* Saved comparisons view
* Responsive interface
* REST API based backend

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* CSS

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* Database

## Project Structure

```text
price-comparison-app/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── state/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── types.ts
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   ├── main.py
│   ├── create_tables.py
│   └── requirements.txt
│
└── README.md
```

## Getting Started

### Frontend

Go to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

### Backend

Go to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

For Windows:

```bash
venv\Scripts\activate
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

## Application Flow

```text
User
  ↓
React Frontend
  ↓
FastAPI REST API
  ↓
Services
  ↓
Database
  ↓
API Response
  ↓
Price Comparison UI
```

## Notes

The frontend and backend are kept as separate applications within the same repository. This keeps the project structure simple while allowing both parts to be developed and run independently.

## Author

Sudhanshu Pathak
