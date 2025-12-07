# Overview
- Retail Sales Management System with a MongoDB-backed API and React UI for TruEstate assignment.
- Implements search, filters, sorting, pagination, and rollup summaries across customer, product, and sales attributes.
- Dataset is seeded into MongoDB from `backend/data/truestate_assignment_dataset.csv`.
- Frontend mirrors the provided layout: inline filter chips, summary cards, transaction table, sorting, and pagination controls.
<img width="1792" height="1032" alt="image" src="https://github.com/user-attachments/assets/04e0717b-dbbf-4c13-b625-4789578e99da" />

# Tech Stack
- Backend: Node.js, Express, Mongoose, dotenv, CORS, Morgan.
- Frontend: React, Vite, modern CSS.

# Search Implementation Summary
- Full-text, case-insensitive search on customer name and phone number using MongoDB regex queries.
- Executed on the backend so filters, sorting, pagination, and summaries all respect the search term.
<img width="1792" height="1031" alt="image" src="https://github.com/user-attachments/assets/ac97c10f-40fc-4e90-9a85-838932a3a6fa" />

# Filter Implementation Summary
- Multi-select filters for region, gender, product category, tags, and payment method.
  <img width="1792" height="1032" alt="image" src="https://github.com/user-attachments/assets/ec6c24b2-36a1-46aa-8fe9-47834900086a" />

- Range filters for age and date; invalid ranges auto-normalize to safe bounds.
  <img width="1792" height="1032" alt="image" src="https://github.com/user-attachments/assets/4e920004-53e1-4a24-a5be-7223385ef7df" />

- Filters compose with search and sorting and persist across pagination.

# Sorting Implementation Summary
- Backend sorting on date (newest first), quantity (high→low), and customer name (A–Z).
  <img width="1792" height="1032" alt="image" src="https://github.com/user-attachments/assets/fca67495-157b-41d5-8d27-b08d1376cd7e" />

- Sort state is maintained with active filters and search; defaults to newest-first by date.
<img width="1792" height="1034" alt="image" src="https://github.com/user-attachments/assets/dc22bdee-cbd2-4827-84a2-a254a82d38e9" />

# Pagination Implementation Summary
- Server-side pagination fixed at 10 records per page with total counts, total pages, and summary rollups (units, amount, discount) returned.
- Frontend keeps search/filter/sort state while navigating pages (page buttons + next/previous).
<img width="1356" height="56" alt="image" src="https://github.com/user-attachments/assets/64eec063-da3e-43ec-bcb0-9a00d3c89fde" />

# Setup Instructions
1. **Backend Setup**:
   - `cd backend`
   - Create a `.env` file with `MONGO_URI=mongodb://localhost:27017/sales` (or your MongoDB connection string).
   - `npm install`
   - `npm run seed` to populate MongoDB from the CSV (uses `backend/src/utils/seedMongo.js`).
   - `npm run dev` to start the server (runs on `http://localhost:4000`).

2. **Frontend Setup**:
   - `cd frontend`
   - `npm install`
   - `npm run dev` (Vite dev server proxied to backend at `http://localhost:5173`).
Optional: set `VITE_API_BASE_URL` in `frontend/.env` when deploying the frontend separately from the API.
