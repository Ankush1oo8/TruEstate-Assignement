# Architecture

## Backend architecture
- Express server (`backend/src/index.js`) connects to MongoDB on startup via Mongoose and exposes REST endpoints under `/api`.
- Search, filtering, sorting, pagination, and summary rollups are centralized in `services/salesService.js` using MongoDB aggregation pipelines (no duplicated logic across controllers).
- Controllers (`controllers/`) reshape query params and delegate to the service; routes (`routes/`) bind controllers to paths; Mongoose model (`models/Sale.js`) defines the sales schema.
- Seeding script (`src/utils/seedMongo.js`) parses the CSV and populates MongoDB (invoked via `npm run seed`).

## Frontend architecture
- React + Vite single-page app renders the required layout: top bar with search/sort, inline filter chips, summary cards, table, and pagination.
- State is centralized in `App.jsx` (search term, filters, sort, page). Data fetching lives in `hooks/useSalesQuery.js`, calling the API client.
- UI components (`components/`) are stateless/presentational: search bar, filter chips, sort dropdown, summary cards, transaction table, and pagination controls. Styling lives in `styles/global.css`.

## Data flow
1. Seeding: The `npm run seed` command is run once to populate the MongoDB database from the CSV file.
2. Server start: The backend connects to the MongoDB database.
3. Client loads: frontend requests `/api/sales/options` to get filter choices generated from MongoDB.
4. Interaction: user updates search/filters/sort/page → frontend issues `/api/sales` with query params.
5. Service layer builds a MongoDB aggregation pipeline based on the query params, executes it, and returns `{ data, page, pageSize, total, totalPages, summary }` consumed by the table, summary cards, and pagination UI.

## Folder structure
- `backend/`: Express API  
  - `src/index.js` (entry), `controllers/`, `services/`, `routes/`, `utils/`, `models/`, `data/` (CSV for seeding).
- `frontend/`: React UI  
  - `src/` with `components/`, `hooks/`, `services/`, `styles/`, plus Vite config and `index.html`.
- `docs/`: architecture notes; `README.md` at repo root for run instructions and implementation summaries.

## Module responsibilities
- `utils/seedMongo.js`: Parses the CSV and seeds MongoDB.
- `models/Sale.js`: Mongoose model for the sales data.
- `services/salesService.js`: Builds and executes MongoDB aggregation pipelines for querying, summaries, and filter options.
- `controllers/salesController.js`: Map HTTP queries to service params and respond with JSON payloads.
- `frontend/src/services/api.js`: Build query strings and call backend endpoints.
- `frontend/src/hooks/useSalesQuery.js`: Manage async data fetching with loading/error states.
- `frontend/src/components/*`: Render UI sections and invoke callbacks; no business logic inside components.
