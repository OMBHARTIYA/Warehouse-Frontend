# Design Direction - Modern Project Management App

## Goal
Upgrade the current Jira-style project management app into a polished modern SaaS dashboard while preserving all existing functionality, routes, data flow, and role-based behavior.

The app should feel more premium, spacious, and visually engaging, inspired by modern SaaS dashboard previews with gradient statistic cards, soft rounded panels, clean navigation, polished badges, and responsive layouts. Use the inspiration as a visual direction only; do not copy it exactly.

## Important Implementation Rule

This project already has page-based and feature-based components. Do not apply only generic global CSS changes. Update the actual page components listed in this file. Codex should inspect and edit the matching component files directly.

## Core Principles

- Keep the existing app features working.
- Do not rewrite the whole app.
- Make focused UI and UX improvements inside the existing component structure.
- Prefer reusable components for cards, badges, buttons, tables, filters, and modals.
- Keep the interface easy to scan and practical for project/task management.
- Maintain good contrast, readable text, and accessible controls.

## Brand and Theme

### Preferred Direction
Use a modern SaaS style with a stronger visual identity.

- Primary accent: red/rose from the current app, upgraded with subtle gradients.
- Optional secondary accent: violet/purple for charts, decorative gradients, and dashboard highlights.
- Background: soft light gray app shell.
- Surfaces: white cards with rounded corners and subtle borders/shadows.
- Buttons: rounded, clear hover states, consistent sizing.
- Badges: soft tinted backgrounds with readable text.

### Color Usage

- Primary actions: red/rose gradient or solid red.
- Secondary actions: white button with colored border/text.
- Dangerous actions: red, but always with confirmation for destructive actions.
- Status colors:
  - Todo: gray/rose subtle badge
  - In Progress: amber/yellow subtle badge
  - Done: green subtle badge
- Priority colors:
  - Low: green
  - Medium: blue or amber
  - High: orange/red
  - Critical: red/rose

## Layout Components to Update

Target files:

- `app/components/layout/AppLayout.tsx`
- `app/components/layout/Sidebar.tsx`
- `app/components/layout/TopBar.tsx`
- shared layout/global styles used by these components

Required changes:

- Make the sidebar look premium, not basic.
- Add stronger logo/brand block.
- Use grouped navigation with a clear `MAIN` label.
- Active nav item must look like a modern pill with subtle rose background, left accent line, and colored icon/text.
- Keep signed-in user and logout at the bottom, but style them as a clean bottom panel.
- TopBar search should look polished with rounded input, icon, and consistent spacing.
- Notification/profile controls should use rounded icon buttons.
- Main content area should feel like a spacious SaaS app shell.
- Do not break protected routes or auth state.

Responsive requirements:

- Sidebar should not crush content on smaller screens.
- Add mobile-friendly behavior where practical.

## Shared UI Helpers to Add or Improve

Suggested target locations:

- `app/components/project-detail/StatusBadge.tsx`
- `app/components/project-detail/PriorityBadge.tsx`
- `app/components/common/*`
- or a small helper file such as `app/lib/formatters.ts` if the project structure supports it

Required changes:

- Create or reuse one status formatter for all pages:
  - `todo` -> `Todo`
  - `in_progress` -> `In Progress`
  - `In_progress` -> `In Progress`
  - `done` -> `Done`
- Create or reuse one priority formatter:
  - `low` -> `Low`
  - `medium` -> `Medium`
  - `high` -> `High`
  - `critical` -> `Critical`
- Use consistent badge styles across Dashboard, Tasks, Project Details, and Recent Tasks.
- Use readable `Unassigned` when no assignee exists.
- Show project names and assignee names instead of raw numeric IDs wherever the data is available.

## Dashboard Page

Target files:

- `app/page.tsx`
- `app/components/dashboard/DashboardView.tsx`
- `app/components/dashboard/StatsOverview.tsx`
- `app/components/dashboard/ChartsSection.tsx`
- `app/components/dashboard/DataSections.tsx`
- `app/components/Skeleton.tsx` if loading UI needs polish

### Header

Required changes:

- Keep large title: `Dashboard`.
- Keep subtitle: `Plan, prioritize, and accomplish your tasks with ease.`
- Add right-side actions in the dashboard header where possible:
  - `Add Project`
  - `Create Task`
- Buttons should match the modern SaaS style: one primary gradient button and one secondary outlined button.
- Do not wire actions to broken routes. If full action support is not available, link to the closest existing page or leave the button disabled with a clear style.

### Summary Cards

Replace plain stat cards with stronger dashboard cards.

Cards:

- Total Projects
- Total Tasks
- Completed Tasks
- Completion Rate

Required changes in `StatsOverview.tsx`:

- All four cards should use modern gradient or accent card styling, not just the first card.
- Use large bold numbers.
- Use small icons inside rounded icon containers.
- Use consistent card height, padding, radius, and shadow.
- Add subtle hover lift.
- Keep data values from the existing statistics API.

### Charts and Analytics

Required changes in `ChartsSection.tsx`:

- Fix labels that overlap charts.
- Add legends where needed.
- Use consistent status/priority colors.
- Prefer donut chart or cleaner pie chart presentation for status.
- Keep axes and labels readable.
- Make chart cards visually match stat cards.

### Recent Tasks and Data Tables

Required changes in `DataSections.tsx`:

- Recent task cards should show task title, project name, status badge, priority badge, and assignee initials/avatar if available.
- Project statistics and user activity tables should have better spacing, cleaner headers, and row hover states.
- Avoid cramped columns and clipped headers.

## Projects Page

Target files:

- `app/projects/page.tsx`
- `app/components/projects/ProjectsView.tsx`
- `app/components/projects/ProjectCard.tsx`
- `app/components/projects/ProjectCreateForm.tsx`
- `app/components/projects/ProjectFilters.tsx`
- `app/components/ErrorMessage.tsx`
- `app/components/Skeleton.tsx`

Required changes:

- Keep search by project name, sort, add project, edit project, and delete project.
- Make page header match Dashboard style with title, subtitle, and Add Project button.
- Make filter/search area look like a polished card.
- Make `ProjectCard.tsx` more visual and consistent:
  - owner readable name
  - initials avatar
  - created date
  - optional task count/completion if already available
  - hover lift/shadow
  - cleaner Edit/Delete action layout
- Add confirmation modal before deleting a project.
- Show toast after project create/update/delete if toast system exists or can be added cleanly.
- Add friendly empty state when no projects match search.

## Tasks Page

Target files:

- `app/tasks/page.tsx`
- `app/components/tasks/TasksView.tsx`
- `app/components/tasks/TaskFilters.tsx`
- `app/components/tasks/TasksTable.tsx`
- `app/components/Skeleton.tsx`
- `app/components/ErrorMessage.tsx`

Required changes:

- Keep status and priority filters.
- Style filters as a modern filter toolbar card.
- In `TasksTable.tsx`, show readable project names instead of numeric project IDs whenever possible.
- In `TasksTable.tsx`, show readable assignee names instead of numeric user IDs whenever possible.
- If data is missing, show `Unassigned` or a readable fallback, not a raw ID.
- Use shared status and priority badges.
- Add row hover states and better table spacing.
- Add empty state when filters return no tasks.
- Do not remove existing columns unless necessary for responsive layout.
- On small screens, table should scroll horizontally instead of breaking layout.

## Project Details Page

Target files:

- `app/projects/[id]/page.tsx`
- `app/components/project-detail/ProjectDetailsView.tsx`
- `app/components/project-detail/TaskListView.tsx`
- `app/components/project-detail/TaskBoardView.tsx`
- `app/components/project-detail/TaskBoardColumn.tsx`
- `app/components/project-detail/TaskCard.tsx`
- `app/components/project-detail/TaskCreateModal.tsx`
- `app/components/project-detail/TaskEditModal.tsx`
- `app/components/project-detail/PriorityBadge.tsx`
- `app/components/project-detail/StatusBadge.tsx`
- `app/components/common/FilterDropdown.tsx`

Required changes:

- Make the project summary card more polished with title, description, owner badge, and optional project stats.
- Make `New task`, `Board`, and `List` controls feel like a modern segmented toolbar.
- Make filters look consistent with the Tasks page filter toolbar.
- List view:
  - use shared badges
  - improve spacing and hover states
  - keep Edit/Delete actions
- Board view:
  - columns should have clear headers and counts: Todo, In Progress, Done
  - task cards should show title, priority, assignee, and created date cleanly
  - add hover states to task cards
  - keep drag-and-drop behavior working if already implemented
- Delete task must show confirmation first.
- Create/edit task modals should use the modal requirements below.
- Board columns should stack vertically on mobile.

## Users Page

Target files:

- `app/users/page.tsx`
- `app/components/users/UsersView.tsx`
- `app/components/users/UsersTable.tsx`

Required changes:

- Keep admin-only behavior.
- Keep user list, role select, reset password, and delete actions.
- Make page header match the rest of the app.
- Make users table polished with better spacing, row hover, and clearer actions.
- Add user search if simple and safe to implement.
- Add role filter if simple and safe to implement.
- Add explanation/tooltip or helper text when current admin delete is disabled.
- Add confirmation before reset password.
- Add confirmation before deleting a user.
- Show toast after role update, reset password, or delete.

## Auth Pages

Target files:

- `app/login/page.tsx`
- `app/register/page.tsx`
- `app/components/auth/LoginView.tsx`
- `app/components/auth/RegisterView.tsx`
- `app/components/LoadingSpinner.tsx`

Required changes:

- Keep existing auth behavior.
- Polish the login/register cards to match the new SaaS visual direction.
- Use consistent button, input, error, and loading styles.
- Do not change API payloads or auth flow.

## Modals

Target files:

- `app/components/project-detail/TaskCreateModal.tsx`
- `app/components/project-detail/TaskEditModal.tsx`
- project form/modal components if present
- reusable modal/confirmation component if added

Required changes:

- Add close X button in the top-right.
- Use consistent modal width and spacing.
- Use softer focus rings instead of heavy black outlines.
- Add validation messages for required fields.
- Disable submit button when required fields are empty.
- Use consistent button labels:
  - `Create Task`
  - `Save Changes`
  - `Cancel`
- Clicking outside the modal or pressing Escape should close it if safe.
- Keep create/edit functionality working.

## Confirmations and Feedback

### Confirmation Modal

Create a reusable confirmation modal if the project does not already have one.

Use it for:

- Delete task
- Delete project
- Delete user
- Reset password

Suggested copy for destructive delete:

> Are you sure you want to delete this item? This action cannot be undone.

### Toast Notifications

Use existing `app/components/ToastProvider.tsx` if available. If it exists, wire it into actions. If it does not work, fix it carefully without changing the app architecture.

Show toast feedback after actions:

- Task created successfully
- Task updated successfully
- Task deleted
- Project created successfully
- Project updated successfully
- Project deleted
- User role updated
- Password reset successfully

## Empty and Loading States

Add friendly empty states where needed:

- No tasks found
- No projects match your search
- No users found
- No recent tasks yet

For loading states, use simple skeletons or soft placeholders where practical.

## Responsive Design

The app should work well on desktop, tablet, and mobile.

- Sidebar should collapse or become mobile-friendly.
- Tables should scroll horizontally on small screens.
- Dashboard cards should stack responsively.
- Board columns should stack vertically on mobile.
- Modals should fit smaller screens with internal scrolling if needed.

## Codex Implementation Instructions

When applying this design:

1. Read this file fully before editing code.
2. Also read `docs/project-structure.md` to confirm the current page/component tree.
3. Inspect the exact target component files listed above.
4. Keep existing functionality, routes, API calls, auth gates, and data flow working.
5. Do not rewrite the entire app.
6. Do not only change global CSS. Edit the page/feature components that render each screen.
7. Make changes in small focused steps.
8. Prefer creating small reusable helpers for label formatting, badge colors, confirmation modals, and entity name lookup.
9. Run build/lint/tests after changes.
10. Summarize changed files and anything not completed.

## Suggested Implementation Order

1. Layout foundation: `AppLayout`, `Sidebar`, `TopBar`, shared buttons/badges/helpers.
2. Dashboard: `DashboardView`, `StatsOverview`, `ChartsSection`, `DataSections`.
3. Tasks: `TasksView`, `TaskFilters`, `TasksTable`.
4. Project Details: `ProjectDetailsView`, list/board/task cards, create/edit modals.
5. Projects: `ProjectsView`, `ProjectCard`, filters/forms.
6. Users: `UsersView`, `UsersTable`.
7. Auth polish: `LoginView`, `RegisterView`.
8. Confirmations, toasts, empty/loading states, responsive fixes.

## Stronger Codex Prompt

Use this prompt after updating this file:

```text
Read design.md and docs/project-structure.md. The app already has per-page components, so do not only apply generic global styling.

First inspect these component groups:
- layout: AppLayout, Sidebar, TopBar
- dashboard: DashboardView, StatsOverview, ChartsSection, DataSections
- projects: ProjectsView, ProjectCard, ProjectCreateForm, ProjectFilters
- tasks: TasksView, TaskFilters, TasksTable
- project-detail: ProjectDetailsView, TaskListView, TaskBoardView, TaskBoardColumn, TaskCard, TaskCreateModal, TaskEditModal, StatusBadge, PriorityBadge
- users: UsersView, UsersTable

Then implement the design in steps:
1. Layout/sidebar/topbar premium polish.
2. Dashboard gradient summary cards, modern charts, recent task cards.
3. Shared badges and readable status/project/assignee names.
4. Projects/tasks/project-details/users page polish.
5. Confirmation modals, toast notifications, empty states, responsive fixes.

Keep all existing functionality and API calls working. Do not rewrite the whole app. Run the build/linter and fix errors. Summarize changed files and what changed.
```
