# Architecture

## Backend architecture
- Express server (`backend/src/index.js`) boots once, loads the CSV via `csv-parse`, caches records in memory, and exposes REST endpoints under `/api`.
- Business logic for search, filtering, sorting, and pagination is centralized in `services/salesService.js` to avoid duplication across controllers or routes.
- Controllers (`controllers/`) validate/reshape query params and delegate to the service; routes (`routes/`) bind controllers to paths; utilities (`utils/`) hold CSV parsing helpers.

## Frontend architecture
- React + Vite single-page app renders the required layout: hero, search, filters, table, sorting, and pagination.
- State is centralized in `App.jsx` (search term, filters, sort, page). Data fetching is encapsulated in `hooks/useSalesQuery.js` which calls the API service.
- UI components (`components/`) are stateless/presentational: search bar, filter panel, sort dropdown, transaction table, and pagination controls. Styling lives in `styles/global.css`.

## Data flow
1. Server start: CSV is parsed once and stored in memory; unique filter options (regions, tags, etc.) are cached.
2. Client loads: frontend requests `/api/sales/options` to render filter choices.
3. Interaction: user updates search/filters/sort/page → frontend issues `/api/sales` with query params.
4. Service layer filters/sorts/paginates the cached dataset and returns `{ data, page, pageSize, total, totalPages }` consumed by the table/pagination UI.

## Folder structure
- `backend/`: Express API  
  - `src/index.js` (entry), `controllers/`, `services/`, `routes/`, `utils/`, `data/` (CSV).
- `frontend/`: React UI  
  - `src/` with `components/`, `hooks/`, `services/`, `styles/`, plus Vite config and `index.html`.
- `docs/`: architecture notes; `README.md` at repo root for run instructions and implementation summaries.

## Module responsibilities
- `utils/csvLoader.js`: parse CSV, normalize numeric/date fields, expand tags.
- `services/salesService.js`: hold dataset cache; compute filter metadata; apply search, filter, sort, pagination in one place.
- `controllers/salesController.js`: map HTTP queries to service params and respond with JSON payloads.
- `frontend/src/services/api.js`: build query strings and call backend endpoints.
- `frontend/src/hooks/useSalesQuery.js`: manage async data fetching with loading/error states.
- `frontend/src/components/*`: render UI sections and invoke callbacks; no business logic inside components.
