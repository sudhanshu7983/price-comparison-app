# Bill — Price Comparison App (Frontend)

A React + Vite + TypeScript frontend for a tool that finds the cheapest way to pay
for something. This is the **frontend only** — there is no backend in this repo.
All data (sources, cards, saved comparisons, sign-in) is mocked/seeded on the
client, described below.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

```bash
npm run build     # type-checks and builds to dist/
npm run preview   # serves the production build locally
```

## What's implemented

- **Email sign-in** — `src/components/SignIn.tsx` validates the email format
  before continuing. The signed-in email is kept in `AuthContext` and persisted
  to `localStorage` so a refresh doesn't sign you out.
- **Search across mocked sources** — typing a query (or tapping a quick action)
  runs a simulated search (`src/data/mockData.ts` + `src/data/compare.ts`) that
  returns 3–4 normalized deals from different mocked sources (offer / coupon /
  cashback), with the cheapest one clearly badged.
- **"Best way to pay" line** — `computeBestWayToPay()` in `src/data/compare.ts`
  picks the cheapest source, then checks whether paying with one of the user's
  seeded cards (`USER_CARDS`) would earn back enough to beat it. Whichever wins
  is shown as the single recommended way to pay.
- **Save a comparison** — saved comparisons are stored in `SavedContext`, keyed
  in `localStorage` **by the signed-in user's email** (`bill.saved.<email>`),
  so switching accounts shows a different, isolated list. Because there's no
  server here, this simulates ownership rather than enforcing it — a real
  backend would need to check the authenticated user server-side too.
- **Validation, loading, error, empty states** — the chat input rejects empty
  or too-short queries; the analyzing/finding/comparing steps show while a
  search is "in flight" (`AnalyzingSteps.tsx`); a search containing the word
  "fail" or "error" simulates a failed request with a retry button, so you can
  see the error state on demand; an empty deal list shows an empty state.
- **Debounced, cancellable search** — new searches debounce briefly before
  "starting", and every step of the simulated request checks a request id
  against the latest one before touching state, so an older, superseded
  search can never overwrite a newer result (`requestIdRef` in `App.tsx`).
- **Price-drop indicator** — `src/data/priceHistory.ts` remembers the best
  price found for each query (per device) and shows a ↑/↓ delta the next time
  you check the same query.
- **Voice input** — the mic button in `ChatInput.tsx` uses the browser's
  `SpeechRecognition` API where available and falls back gracefully (with a
  message) where it isn't.
- **Skeleton loaders** for the deal list while a search is running.

## Screens

- **Home** — greeting, your tracked bills strip, quick actions, chat input.
- **Conversation** — your query, the analyzing steps, then results: deal
  cards with the cheapest one badged, the best-way-to-pay summary, and a save
  button. A follow-up input stays at the bottom.
- **Saved** — reachable from "Your cards" or the menu button; lists only the
  signed-in user's saved comparisons, with a real empty state.

## Project structure

```
src/
  components/     UI components (presentational, mostly stateless)
  state/          AuthContext, SavedContext (React context + localStorage)
  data/           mock dataset, comparison/reward logic, price history
  styles/         tokens.css (design tokens) + global.css
  types.ts        shared TypeScript types
```

## Known limitations (frontend-only scope)

- There's no real backend, database, or authentication — sign-in and saved
  data are simulated in `localStorage` for demo purposes.
- Search results are deterministically generated from the query text (same
  query → same numbers) rather than coming from real integrations, per the
  assignment brief.
