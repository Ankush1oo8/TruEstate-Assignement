# Overview
- Retail Sales Management System with CSV-backed API and React UI for TruEstate assignment.
- Implements search, filters, sorting, and pagination across customer, product, and sales attributes.
- Dataset is loaded once on the backend from `backend/data/truestate_assignment_dataset.csv`.
- Frontend mirrors the provided layout: search bar, filter panel, transaction table, sorting, and pagination controls.

# Tech Stack
- Backend: Node.js, Express, csv-parse, CORS, Morgan.
- Frontend: React, Vite, modern CSS.

# Search Implementation Summary
- Full-text, case-insensitive search on customer name and phone number.
- Executed on the backend so filters, sorting, and pagination all respect the search term.

# Filter Implementation Summary
- Multi-select filters for region, gender, product category, tags, and payment method.
- Range filters for age and date; invalid ranges auto-normalize to safe bounds.
- Filters compose with search and sorting and persist across pagination.

# Sorting Implementation Summary
- Backend sorting on date (newest first), quantity (high→low), and customer name (A–Z).
- Sort state is maintained with active filters and search; defaults to newest-first by date.

# Pagination Implementation Summary
- Server-side pagination fixed at 10 records per page with total counts and total pages returned.
- Frontend keeps search/filter/sort state while navigating pages (next/previous).

# Setup Instructions
1) Backend: `cd backend && npm install && npm run dev` (starts on `http://localhost:4000` and auto-loads the CSV).
2) Frontend: `cd frontend && npm install && npm run dev` (Vite dev server proxied to backend at `http://localhost:5173`).
Optional: set `VITE_API_BASE_URL` in `frontend/.env` when deploying the frontend separately from the API.
