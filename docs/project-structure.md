Project name:
Jira Clone Frontend (Next.js App Router)
Main users:
- Admin
- Member user
Main features:
- Authentication (login/register/logout)
- Dashboard statistics and charts
- Project management
- Project detail with list/board tasks and drag-and-drop
- Global task list and filters
- Admin user management

Pages:
1. `/` (Dashboard)
2. `/login`
3. `/register`
4. `/projects`
5. `/projects/[id]`
6. `/tasks`
7. `/users`

For each page:

- Page: `/` (Dashboard)
- What appears on screen?
  - App shell (sidebar/topbar) with dashboard header, overview cards, charts, recent tasks, project stats, user activity
  - Loading skeleton, error message, and empty state variants
- What data does it need?
  - Statistics payload from `GET /api/statistics`
  - Authenticated user context for protected access
- What actions can user do?
  - Search dashboard data through header search
  - Navigate to other areas via layout navigation
- Component tree (pattern):
  - Page
    - `app/page.tsx`
  - Big feature component
    - `app/components/dashboard/DashboardView.tsx`
  - Smaller feature component
    - `app/components/dashboard/StatsOverview.tsx`
    - `app/components/dashboard/ChartsSection.tsx`
    - `app/components/dashboard/DataSections.tsx`
  - Small reusable UI component
    - `app/components/Skeleton.tsx`

- Page: `/login`
- What appears on screen?
  - Login form (username/password), submit action, validation/error feedback
- What data does it need?
  - Auth API response from `POST /api/auth/login`
- What actions can user do?
  - Submit credentials and sign in
  - Navigate to registration page
- Component tree (pattern):
  - Page
    - `app/login/page.tsx`
  - Big feature component
    - `app/components/auth/LoginView.tsx`
  - Smaller feature component
    - form section inside `LoginView`
  - Small reusable UI component
    - `app/components/LoadingSpinner.tsx` (when submitting/loading)

- Page: `/register`
- What appears on screen?
  - Registration form (username/email/password), submit action, validation/error feedback
- What data does it need?
  - Auth API response from `POST /api/auth/register`
- What actions can user do?
  - Create account
  - Navigate to login page
- Component tree (pattern):
  - Page
    - `app/register/page.tsx`
  - Big feature component
    - `app/components/auth/RegisterView.tsx`
  - Smaller feature component
    - form section inside `RegisterView`
  - Small reusable UI component
    - `app/components/LoadingSpinner.tsx` (when submitting/loading)

- Page: `/projects`
- What appears on screen?
  - Projects header, optional create form, search/sort filters, project cards, loading/error/empty states
- What data does it need?
  - Project list from `GET /api/projects`
  - Auth user for permission checks
  - Create/edit/delete responses from project endpoints
- What actions can user do?
  - Create project
  - Search/sort projects
  - Edit/delete own/admin-managed projects
  - Open project detail page
- Component tree (pattern):
  - Page
    - `app/projects/page.tsx`
  - Big feature component
    - `app/components/projects/ProjectsView.tsx`
  - Smaller feature component
    - `app/components/projects/ProjectCard.tsx`
    - `app/components/projects/ProjectCreateForm.tsx`
    - `app/components/projects/ProjectFilters.tsx`
  - Small reusable UI component
    - `app/components/ErrorMessage.tsx`
    - `app/components/Skeleton.tsx`

- Page: `/projects/[id]`
- What appears on screen?
  - Project header/details card
  - View toggle (list/board), task filters, sort dropdown in list mode
  - Task list or Kanban board with columns/cards
  - Create and edit task modals
- What data does it need?
  - Project details from `GET /api/projects/:id`
  - Project tasks from `GET /api/tasks?projectId=:id`
  - Users for assignment from `GET /api/users`
  - Task mutation responses from create/update/delete endpoints
- What actions can user do?
  - Create, edit, delete tasks
  - Filter tasks by status/priority/assignee
  - Sort tasks in list mode
  - Drag and drop tasks across board columns (status update)
  - Switch list/board view
  - Return to projects page
- Component tree (pattern):
  - Page
    - `app/projects/[id]/page.tsx`
  - Big feature component
    - `app/components/project-detail/ProjectDetailsView.tsx`
  - Smaller feature component
    - `app/components/project-detail/TaskListView.tsx`
    - `app/components/project-detail/TaskBoardView.tsx`
    - `app/components/project-detail/TaskBoardColumn.tsx`
    - `app/components/project-detail/TaskCreateModal.tsx`
    - `app/components/project-detail/TaskEditModal.tsx`
  - Small reusable UI component
    - `app/components/project-detail/TaskCard.tsx`
    - `app/components/project-detail/PriorityBadge.tsx`
    - `app/components/project-detail/StatusBadge.tsx`
    - `app/components/common/FilterDropdown.tsx`

- Page: `/tasks`
- What appears on screen?
  - Tasks header, filters, tasks table, loading/error/empty states
- What data does it need?
  - All tasks from `GET /api/tasks`
- What actions can user do?
  - Filter tasks by status and priority
  - View task details in table rows
- Component tree (pattern):
  - Page
    - `app/tasks/page.tsx`
  - Big feature component
    - `app/components/tasks/TasksView.tsx`
  - Smaller feature component
    - `app/components/tasks/TaskFilters.tsx`
    - `app/components/tasks/TasksTable.tsx`
  - Small reusable UI component
    - `app/components/Skeleton.tsx`
    - `app/components/ErrorMessage.tsx`

- Page: `/users` (admin only)
- What appears on screen?
  - Users header and users table
  - Role select, password reset inline form, delete actions
  - Loading/error/empty states
- What data does it need?
  - User list from `GET /api/users`
  - Role/password updates from `PUT /api/users/:id`
  - Delete responses from `DELETE /api/users/:id`
  - Auth user for admin gate and self-protection
- What actions can user do?
  - Change user role
  - Reset user password
  - Delete user (except self, enforced in UI flow)
- Component tree (pattern):
  - Page
    - `app/users/page.tsx`
  - Big feature component
    - `app/components/users/UsersView.tsx`
  - Smaller feature component
    - `app/components/users/UsersTable.tsx`
  - Small reusable UI component
    - loading/error blocks rendered in `UsersView`

Components:
- Shared components:
  - `app/components/LoadingSpinner.tsx`
  - `app/components/ErrorMessage.tsx`
  - `app/components/Skeleton.tsx`
  - `app/components/ProtectedRoute.tsx`
  - `app/components/RouteLayout.tsx`
  - `app/components/ToastProvider.tsx`
  - `app/components/common/FilterDropdown.tsx`
  - `app/components/layout/AppLayout.tsx`
  - `app/components/layout/Sidebar.tsx`
  - `app/components/layout/TopBar.tsx`
- Feature components:
  - Auth: `app/components/auth/LoginView.tsx`, `app/components/auth/RegisterView.tsx`
  - Dashboard: `app/components/dashboard/*`
  - Projects: `app/components/projects/*`
  - Project detail: `app/components/project-detail/*`
  - Tasks: `app/components/tasks/*`
  - Users: `app/components/users/*`

Data types:
- User
  - Defined/shared in `types/auth.ts` and feature-specific user types in `app/components/users/types.ts`
- Project
  - Defined in `app/components/projects/types.ts` and project-detail types where needed
- Task
  - Defined in `app/components/tasks/types.ts` and `app/components/project-detail/types.ts`

API calls:
- GET
  - `/api/auth/me`
  - `/api/statistics`
  - `/api/projects`
  - `/api/projects/:id`
  - `/api/tasks`
  - `/api/tasks?projectId=:id`
  - `/api/users`
- POST
  - `/api/auth/login`
  - `/api/auth/register`
  - `/api/projects`
  - `/api/tasks`
- PUT
  - `/api/projects/:id`
  - `/api/tasks/:id`
  - `/api/users/:id`
- DELETE
  - `/api/projects/:id`
  - `/api/tasks/:id`
  - `/api/users/:id`

Build order:
1. Foundation: `app/layout.tsx`, auth context (`app/context/AuthContext.tsx`), route/layout guards, shared axios client (`lib/api.ts`), shared shell/layout components.
2. Core signed-in experience: Dashboard (`/`), Projects list (`/projects`), Tasks list (`/tasks`), including loading/error states and filtering.
3. Advanced features and admin: Project detail task workflows (`/projects/[id]` with board/list, modals, DnD) and admin user management (`/users`).
