## Backend

Express API backed by MongoDB that exposes `/api/sales` with search, filters, sorting, pagination, and rollup summaries, plus `/api/sales/options` for filter metadata. Seed MongoDB from `data/truestate_assignment_dataset.csv` via `npm run seed`.

### Run locally

```bash
cd backend
npm install
npm run seed   # populate MongoDB once
npm run dev
```

The server defaults to `http://localhost:4000`.
