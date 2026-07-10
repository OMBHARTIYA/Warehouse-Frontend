# Warehouse Management App - Project Overview

## Goal
Build a portfolio-safe Warehouse Management application for small-scale inventory operations.

## Current Status
- Frontend: Next.js app (connected repository)
- Backend: clean-room Node.js/Express API in a separate fresh repository folder
- Auth: JWT-based login available in the clean backend
- Data: sanitized demonstration records only

## Domain Model
- `warehouses`
- `products`
- `stock`
- `movements`
- `users`

## MVP Features
1. Warehouse CRUD
2. Product catalog (SKU, name, category, reorder level)
3. Stock by warehouse
4. Inventory movement logs
5. Basic dashboard (low stock, inbound/outbound counts)

## Zero-Cost Deployment Plan (Validation Stage)
- Frontend hosting: Vercel Hobby (free)
- Backend hosting: Render free service or another low-cost Node host
- Data layer: sanitized demo dataset first, managed Postgres later if needed

## Important Technical Note
Do not publish private workplace datasets, screenshots, or source artifacts. Public portfolio data must remain synthetic and safe to share.

## Next Technical Steps
1. Publish the clean backend repository from `Warehouse-Backend-Clean`
2. Deploy the clean backend
3. Update frontend environment variables to point to the clean backend
4. Test the live frontend with demo login
5. Keep non-public workplace examples separate from public repos

## Owner
GitHub user: OMBHARTIYA
