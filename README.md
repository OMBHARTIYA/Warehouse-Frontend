# Warehouse Management App 

A practical warehouse management application built from the existing task-manager foundation and adapted for small-scale company operations.

## Project Objective
Create a live, multi-user warehouse system that supports:
- warehouse/location management
- product catalog management
- stock visibility by warehouse
- inventory movement tracking (inbound, outbound, transfer, adjustment)
- basic operational dashboard

## Current Architecture
- Frontend: Next.js (this repository)
- Backend: Node.js + Express (local backend project)
- Auth: JWT-based

## Domain Transformation Plan
- `projects` -> `warehouses`
- `tasks` -> `inventory movements`
- Keep `users` for roles and permissions
- Add `products`, `stock`, and movement history tables

## Deployment Strategy (Free Validation Stage)
For initial 2-3 user testing:
- Frontend: Vercel Hobby (free)
- Backend: Render free service or Railway trial
- Database: Neon/Supabase free Postgres

## Important Note
The current backend uses a local `sql.js` file database. Before live testing, migrate to managed Postgres for reliable cloud persistence.

## Roadmap
1. Backend DB migration to Postgres
2. Warehouse/Product/Stock/Movement APIs
3. Frontend modules for warehouse workflows
4. Deploy frontend/backend with environment variables
5. Validate end-to-end with 2-3 users

## Project Document
Detailed plan: `PROJECT_OVERVIEW.md`

## Owner
GitHub: `OMBHARTIYA`
