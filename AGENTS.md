
# AGENTS.md

## Project goal

This is a warehouse management frontend built with Next.js. The clean backend API provides auth, RBAC, warehouses, products, stock, movements, users, and dashboard statistics with sanitized demo data.

The main goal for agents is to keep the app easy to edit, easy to track, and split into small reusable components. Do not build huge page files. Pages should compose components, not contain all UI, fetching, forms, modals, tables, and drag-and-drop logic in one place.

## Current project facts

Use the current project, not the original README's Vite suggestion.

- Framework: Next.js App Router
- React: React 19
- Language: TypeScript
- Styling: Tailwind CSS 4 classes in JSX
- HTTP client: axios through `lib/api.ts`
- Auth state: `app/context/AuthContext.tsx`
- Toasts: `react-hot-toast`
- Charts: `recharts`
- Kanban drag and drop: `@hello-pangea/dnd`
- Path alias: `@/*` points to the repo root
- API base URL: `NEXT_PUBLIC_API_BASE_URL`, fallback `http://localhost:3000`

Current important files:

```txt
app/layout.tsx
app/components/RouteLayout.tsx
app/components/AppLayout.tsx
app/context/AuthContext.tsx
lib/api.ts
app/page.tsx
app/projects/page.tsx
app/projects/[id]/page.tsx
app/tasks/page.tsx
app/users/page.tsx
```

## Commands

Run commands from the project root.

```bash
npm install
npm run dev
npm run lint
npm run build
```

Before finishing any code change, run at least:

```bash
npm run lint
```

If the change touches routing, data fetching, auth, or types, also run:

```bash
npm run build
```

## Backend API contract

Use the existing backend API. Do not invent endpoints.

Base URL:

```txt
http://localhost:3000
```

Auth:

```txt
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

Users:

```txt
GET /api/users
GET /api/users/:id
PUT /api/users/:id
DELETE /api/users/:id
```

Warehouses:

```txt
GET /api/warehouses
POST /api/warehouses
GET /api/warehouses/:id
PUT /api/warehouses/:id
DELETE /api/warehouses/:id
```

Inventory:

```txt
GET /api/products
GET /api/stock
GET /api/stock?warehouseId=:id
GET /api/movements
GET /api/movements?warehouseId=:id
```

Statistics:

```txt
GET /api/warehouse-statistics
```

Every request except login/register needs:

```txt
Authorization: Bearer <token>
```

Always use the shared axios client in `lib/api.ts` unless there is a strong reason not to.

## Architecture rule: small reusable pieces

This is the most important rule in this project.

Do not put full features into one large page component. Split UI, state, API calls, and helpers into smaller files that can be edited independently.

Recommended limits:

- Page files: ideally under 120 lines
- UI component files: ideally under 150 lines
- Hooks/services: ideally under 180 lines
- If a file grows above 250 lines, refactor before adding more features
- Avoid files above 400 lines unless there is a very strong reason

Current refactor priority:

```txt
app/projects/[id]/page.tsx
```

This file currently owns project details, task loading, filters, forms, modals, list view, board view, drag-and-drop, and CRUD actions. Future agents should split it before adding major new behavior.

## Target folder structure

Prefer this structure going forward:

```txt
app/
  layout.tsx
  page.tsx
  login/page.tsx
  register/page.tsx
  projects/page.tsx
  projects/[id]/page.tsx
  tasks/page.tsx
  users/page.tsx

components/
  common/
    ErrorMessage.tsx
    LoadingSpinner.tsx
    Skeleton.tsx
    EmptyState.tsx
    ConfirmDialog.tsx
  layout/
    AppLayout.tsx
    RouteLayout.tsx
  ui/
    Button.tsx
    Input.tsx
    Select.tsx
    Modal.tsx

features/
  auth/
    components/
      LoginForm.tsx
      RegisterForm.tsx
    hooks/
      useAuthRedirect.ts
    types.ts
  dashboard/
    components/
      DashboardHeader.tsx
      StatsOverview.tsx
      TaskStatusChart.tsx
      TaskPriorityChart.tsx
      UserActivityTable.tsx
      RecentTasksList.tsx
      ProjectStatsList.tsx
    hooks/
      useDashboardStats.ts
    types.ts
  projects/
    components/
      ProjectsHeader.tsx
      ProjectCard.tsx
      ProjectCreateForm.tsx
      ProjectEditForm.tsx
      ProjectFilters.tsx
    hooks/
      useProjects.ts
      useProjectFilters.ts
    services/
      projectService.ts
    types.ts
  project-detail/
    components/
      ProjectHeader.tsx
      ProjectViewToggle.tsx
      TaskFiltersBar.tsx
      TaskListView.tsx
      TaskBoardView.tsx
      TaskBoardColumn.tsx
      TaskCard.tsx
      TaskCreateModal.tsx
      TaskEditModal.tsx
      TaskForm.tsx
      PriorityBadge.tsx
      StatusBadge.tsx
    hooks/
      useProjectDetails.ts
      useProjectTasks.ts
      useTaskFilters.ts
      useTaskMutations.ts
      useTaskModalFocus.ts
    services/
      taskService.ts
    types.ts
    utils.ts
  users/
    components/
      UsersHeader.tsx
      UsersTable.tsx
      UserRoleSelect.tsx
      PasswordResetForm.tsx
    hooks/
      useUsers.ts
    services/
      userService.ts
    types.ts

lib/
  api.ts
  permissions.ts
  format.ts

types/
  auth.ts
```

It is okay to migrate gradually. Do not move every file at once unless the task is specifically a refactor task.

## Next.js App Router rules

Use Next.js App Router conventions:

- Use `app/.../page.tsx` for route entry points.
- Use `next/link` instead of React Router links.
- Use `next/navigation` for `useRouter`, `usePathname`, and `useParams`.
- Do not install or use `react-router-dom`.
- Mark components with `"use client"` only when they need client features like state, effects, localStorage, router hooks, drag-and-drop, or browser events.
- Keep `app/layout.tsx` as the root shell with providers.
- Keep public route handling compatible with `RouteLayout`.

## Component responsibility rules

Each component should have one clear job.

Good examples:

```txt
ProjectHeader.tsx       -> shows project name, description, owner, created date
TaskFiltersBar.tsx      -> controls status, priority, assignee filters
TaskListView.tsx        -> renders table/list version of tasks
TaskBoardView.tsx       -> renders Kanban board wrapper
TaskBoardColumn.tsx     -> renders one status column
TaskCard.tsx            -> renders one task card
TaskForm.tsx            -> reusable create/edit task fields
TaskCreateModal.tsx     -> create modal wrapper and submit action
TaskEditModal.tsx       -> edit modal wrapper and submit action
PriorityBadge.tsx       -> priority color display
StatusBadge.tsx         -> task status display
```

Bad examples:

```txt
ProjectDetailsPage.tsx  -> everything for project, tasks, modals, filters, board, list, and API
Dashboard.tsx           -> all dashboard cards, charts, tables, fetching, and formatting
Manager.tsx             -> vague file name with unclear ownership
```

## Page composition rule

Page files should mostly wire together hooks and components.

Preferred style:

```tsx
export default function ProjectDetailsPage() {
  const projectId = useProjectId();
  const projectState = useProjectDetails(projectId);
  const taskState = useProjectTasks(projectId);
  const filters = useTaskFilters(taskState.tasks);

  return (
    <section className="space-y-4">
      <ProjectHeader project={projectState.project} />
      <ProjectViewToggle />
      <TaskFiltersBar {...filters.controls} />
      <TaskListView tasks={filters.filteredTasks} />
      <TaskCreateModal projectId={projectId} onCreated={taskState.reload} />
    </section>
  );
}
```

Avoid adding long JSX sections directly inside pages.

## State, hooks, and services

Use this separation:

```txt
components/  -> visual UI and small event callbacks
hooks/       -> state, effects, filtering, modal state, focus handling
services/    -> API calls only
types.ts     -> TypeScript types for the feature
utils.ts     -> pure helper functions
```

Examples:

```txt
useProjectTasks.ts      -> load tasks, reload tasks, loading/error state
useTaskFilters.ts       -> status/priority/assignee filters and filtered result
useTaskMutations.ts     -> create/update/delete/drag status update
useTaskModalFocus.ts    -> Escape key, focus first input, focus trap
 taskService.ts         -> getTasks, createTask, updateTask, deleteTask
```

Do not duplicate API calls across many components. Put reusable calls in service files.

## Naming rules

Use clear names:

```txt
IssueCard.tsx / TaskCard.tsx
ProjectCard.tsx
TaskCreateModal.tsx
TaskEditModal.tsx
PriorityBadge.tsx
StatusBadge.tsx
useTaskFilters.ts
projectService.ts
taskService.ts
```

Avoid vague names:

```txt
Card.tsx
Box.tsx
Main.tsx
Data.tsx
Manager.tsx
Component.tsx
```

Generic names are only allowed in shared UI folders, for example `components/ui/Button.tsx`.

## TypeScript rules

- Keep `strict` TypeScript passing.
- Prefer named prop types.
- Avoid `any`.
- Normalize uncertain API responses in one place.
- Put feature types in the feature folder.
- Keep shared user/auth types in `types/auth.ts`.

Preferred component pattern:

```tsx
type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string | number) => void;
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return <article>{task.title}</article>;
}
```

## API and auth rules

- Use `lib/api.ts` for HTTP requests.
- Do not manually repeat Authorization headers unless bootstrapping auth requires it.
- Keep the token key as `token` unless intentionally migrating storage.
- On 401, clear token and redirect to `/login`.
- On 403, show a permission error toast.
- Never trust client-side role checks as security. They are for UX only; backend RBAC is the source of truth.
- Admin-only UI should check `user.role === "admin"`.
- Owner-only warehouse actions should compare current user id with `owner_id` when available.

## Forms and validation

- Prefer `react-hook-form` for larger forms.
- Use `zod` when validation becomes more than simple required fields.
- Login fields: username, password.
- Register fields: username, email, password.
- Warehouse form fields: code, name, description, address.
- Movement display fields: reference code, type, status, product, warehouse, quantity.
- Passwords must be at least 6 characters where the frontend validates them.
- Use proper input types: `email`, `password`, `text`.

## UI and responsive rules

- Use Tailwind classes consistently.
- Keep the warehouse operations style clean, dense, and readable.
- Tables must have mobile horizontal scrolling.
- Modals should close on Escape and backdrop click.
- Modals should focus the first input on open.
- Forms and buttons need visible focus states.
- Deletions require confirmation.
- Use shared loading, error, empty, and skeleton components instead of rebuilding them.
- Mobile support starts at 320px width.

## Feature requirements from the README

Keep these feature areas aligned with the API assignment:

1. Auth: login, registration, token storage, redirect after login, public route redirects.
2. Layout: Dashboard, Projects, Tasks, Users for admin only, logout, signed-in username.
3. Dashboard: overview cards, status chart, priority chart, user activity, recent tasks, project stats.
4. Projects: list, create, edit, delete, search, sort, link to project tasks.
5. Project detail: project header, board/list toggle, task filters, task create/edit/delete, drag-and-drop status update.
6. Users admin: list users, edit role, reset password, delete user except self.
7. Error/loading: axios interceptors, toasts, skeletons, error boundary, 404 page.
8. UX: responsive sidebar, responsive tables, modal focus, keyboard navigation.

## Refactor plan for current state

When improving structure, refactor in small safe steps.

Recommended order:

1. Extract badges and helpers:
   - `PriorityBadge.tsx`
   - `StatusBadge.tsx`
   - `project-detail/types.ts`
   - `project-detail/utils.ts`

2. Extract task display:
   - `TaskListView.tsx`
   - `TaskCard.tsx`
   - `TaskBoardColumn.tsx`
   - `TaskBoardView.tsx`

3. Extract filters:
   - `TaskFiltersBar.tsx`
   - `useTaskFilters.ts`

4. Extract forms and modals:
   - `TaskForm.tsx`
   - `TaskCreateModal.tsx`
   - `TaskEditModal.tsx`
   - `useTaskModalFocus.ts`

5. Extract API and mutations:
   - `taskService.ts`
   - `useProjectTasks.ts`
   - `useTaskMutations.ts`
   - `useProjectDetails.ts`

After each step, run lint and manually check the route you touched.

## Dependency rules

Current dependencies already cover the assignment. Do not add new dependencies unless clearly justified.

Already available:

```txt
axios
react-hook-form
react-hot-toast
recharts
@hello-pangea/dnd
lucide-react
zod
zustand
```

Do not add:

```txt
react-router-dom
react-beautiful-dnd
another toast library
another chart library
```

Use `@hello-pangea/dnd`, not `react-beautiful-dnd`.

## Editing rules for agents

When asked to change one UI part, edit the smallest related file.

Examples:

- Priority colors -> edit `PriorityBadge.tsx` or priority utility only.
- Task table layout -> edit `TaskListView.tsx`.
- Kanban card layout -> edit `TaskCard.tsx`.
- Task filters -> edit `TaskFiltersBar.tsx` or `useTaskFilters.ts`.
- Task create/edit fields -> edit `TaskForm.tsx`.
- API task behavior -> edit `taskService.ts` or `useTaskMutations.ts`.
- Sidebar navigation -> edit `AppLayout.tsx`.
- Auth behavior -> edit `AuthContext.tsx`, `RouteLayout.tsx`, or `lib/api.ts`.

Do not rewrite unrelated files. Do not reformat the whole project.

## Final response rules for agents

When finishing work, include:

```txt
Changed files:
- path/to/file.tsx

What changed:
- short summary

Checks run:
- npm run lint
- npm run build, if run

Notes:
- remaining risks or follow-up work
```

If a check was not run, say so honestly.
