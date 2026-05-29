# Warehouse Management App - Project Overview

## Goal
Transform the current Task Manager application into a Warehouse Management application for small-scale company operations.

## Current Status
- Frontend: Next.js app (connected repository)
- Backend: Node.js/Express app (local, separate folder)
- Auth: JWT-based login already available
- Existing entities: users, projects, tasks

## Domain Migration Plan
- `projects` -> `warehouses`
- `tasks` -> `inventory movements` (inbound, outbound, transfer, adjustment)
- Add `products` and `stock` models
- Keep users/roles for operations access control

## MVP Features
1. Warehouse CRUD
2. Product catalog (SKU, name, category, reorder level)
3. Stock by warehouse
4. Inventory movement logs
5. Basic dashboard (low stock, inbound/outbound counts)

## Zero-Cost Deployment Plan (Validation Stage)
- Frontend hosting: Vercel Hobby (free)
- Backend hosting: Render free service (or Railway trial)
- Database: Neon/Supabase free Postgres

## Important Technical Note
Current backend uses local `sql.js` file database. Before public testing, migrate backend DB to managed Postgres for reliable multi-user cloud access.

## Next Technical Steps
1. Add Postgres support in backend
2. Create warehouse/product/stock/movement tables
3. Expose warehouse APIs
4. Connect frontend to new APIs
5. Deploy and test with 2-3 users

## Owner
GitHub user: OMBHARTIYA
