# Warehouse OS — Project Overview

## Goal

Warehouse OS is a portfolio-safe application for small-team inventory operations.
Only synthetic demonstration data belongs in its public repositories and hosted
demo.

## Current deployment

- Frontend repository: `OMBHARTIYA/Warehouse-Frontend`
- Frontend host: Vercel project `warehouse-os`
- Production frontend: `https://warehouse-os-app.vercel.app`
- Backend repository: `OMBHARTIYA/Warehouse-Backend`
- Production API: `https://warehouse-backend-n8ds.onrender.com`

## Domain model

- warehouses
- products
- stock
- movements
- users

## Current features

- JWT authentication and admin/user roles
- warehouse creation, reading, editing, and deletion
- product catalogue and stock by warehouse
- inventory movement history
- dashboard summaries and admin user management

## Data and security boundary

The hosted version is a demonstration system with in-memory synthetic data. It is
not approved for confidential or business-critical data. A production system
would need durable storage, HttpOnly cookie sessions, audit logs, backups, account
recovery, monitoring, and a formal security review.

## Next improvements

1. Move authentication from browser local storage to secure HttpOnly cookies.
2. Add a durable database with migrations and backups.
3. Add automated authorization and API integration tests.
4. Add audit logging for administrative and inventory changes.
5. Expand stock adjustment and movement creation workflows.

## Owner

GitHub user: `OMBHARTIYA`
