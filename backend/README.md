## Backend

Express API that loads the provided CSV once at startup and exposes `/api/sales` with search, filters, sorting, and pagination, plus `/api/sales/options` for filter metadata.

### Run locally

```bash
cd backend
npm install
npm run dev
```

The server defaults to `http://localhost:4000`.
