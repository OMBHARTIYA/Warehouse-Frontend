# Design Direction - Modern Project Management App

## Goal
Upgrade the current Jira-style project management app into a polished modern SaaS dashboard while preserving all existing functionality, routes, data flow, and role-based behavior.

The app should feel more premium, spacious, and visually engaging, inspired by modern SaaS dashboard previews with gradient statistic cards, soft rounded panels, clean navigation, polished badges, and responsive layouts. Use the inspiration as a visual direction only; do not copy it exactly.

## Core Principles

- Keep the existing app features working.
- Do not rewrite the whole app.
- Make focused UI and UX improvements.
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

## Layout

### App Shell

- Keep a left sidebar and main content area.
- Main content should sit inside a spacious rounded container.
- Use consistent page padding and vertical spacing.
- Make page headers clearer with title, subtitle, and primary actions.

### Sidebar

Improve the sidebar to feel more premium.

- Add a stronger logo/brand area.
- Keep the app navigation simple.
- Group navigation items if useful:
  - Main: Dashboard, Projects, Tasks, Users
  - Workspace/Future: Reports, Calendar, Settings if implemented later
- Active menu item should use a pill background and accent left border or icon color.
- Keep the signed-in user and logout area at the bottom.
- On smaller screens, sidebar should collapse or become mobile-friendly.

## Dashboard Page

### Header

- Large title: Dashboard
- Subtitle: Plan, prioritize, and accomplish your tasks with ease.
- Add clear action buttons where useful:
  - Add Project
  - Create Task
  - Export CSV or Import Data if supported

### Summary Cards

Replace simple stat cards with stronger dashboard cards.

Cards:
- Total Projects
- Total Tasks
- Completed Tasks
- Completion Rate

Design:
- Use large bold numbers.
- Use soft gradients or strong accent backgrounds for important cards.
- Include small icons in rounded icon containers.
- Keep card height and spacing consistent.
- Add subtle hover lift/shadow.

### Charts and Analytics

Improve visual polish and readability.

- Fix labels that overlap charts.
- Add legends where needed.
- Use consistent status/priority colors.
- Consider replacing pie chart with a donut chart or cleaner segmented card.
- Keep axes and labels readable.

### Recent Tasks

Make recent task cards cleaner.

Each recent task should show:
- Task title
- Project name
- Status badge
- Priority badge
- Assignee initials/avatar if available

## Projects Page

Keep current features:
- Search by project name
- Sort
- Add Project
- Edit Project
- Delete Project

Improve:
- Project cards should feel more visual and consistent.
- Show owner as readable name and/or initials avatar.
- Show created date in a consistent format.
- If task counts or completion percentage are available, show them on the card.
- Add hover state to project cards.
- Add confirmation modal before project delete.

## Tasks Page

Keep current table and filters.

Improve:
- Show readable project names instead of numeric project IDs.
- Show readable assignee names instead of numeric user IDs.
- Show `Unassigned` for missing assignees.
- Format statuses as human-readable labels:
  - `todo` -> `Todo`
  - `in_progress` or `In_progress` -> `In Progress`
  - `done` -> `Done`
- Format priorities consistently:
  - `low` -> `Low`
  - `medium` -> `Medium`
  - `high` -> `High`
  - `critical` -> `Critical`
- Add row hover states.
- Improve table spacing and column alignment.
- Add empty state when filters return no tasks.

## Project Details Page

Keep current features:
- Project summary card
- New task modal
- Board/List toggle
- Filters by status, priority, assignee
- Sort in list mode
- Edit/Delete task actions

Improve:
- Make the project summary card more polished.
- Make Board/List toggle visually clearer.
- Improve task cards in board view.
- Board columns should have clear headers and counts:
  - Todo
  - In Progress
  - Done
- Task cards should show title, priority, assignee, and created date cleanly.
- Add hover states to task cards.
- Make board columns stack vertically on mobile.

## Users Page

Keep current features:
- User list
- Role select
- Reset Password
- Delete

Improve:
- Add user search if simple to implement.
- Add role filter if simple to implement.
- Add better disabled state/explanation for deleting the current admin account.
- Add confirmation before reset password.
- Add confirmation before deleting a user.
- Show toast after role update, reset password, or delete.

## Modals

Improve create/edit modals.

- Add close X button in the top-right.
- Use consistent modal width and spacing.
- Use softer focus rings instead of heavy black outlines.
- Add validation messages for required fields.
- Disable submit button when required fields are empty.
- Use consistent button labels:
  - Create Task
  - Save Changes
  - Cancel
- Clicking outside the modal or pressing Escape should close it if safe.

## Confirmations and Feedback

### Delete Confirmation

All destructive actions should show a confirmation modal:

- Delete task
- Delete project
- Delete user

Suggested copy:

> Are you sure you want to delete this item? This action cannot be undone.

### Toast Notifications

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

## Implementation Guidance for Codex

When applying this design:

1. Read this file fully before editing code.
2. Inspect the current React components, routes, data models, and styles.
3. Keep existing functionality and data flow working.
4. Do not rewrite the entire app.
5. Make focused component/style updates.
6. Prefer creating small reusable helpers for label formatting, badge colors, and entity name lookup.
7. Run build/lint/tests after changes.
8. Summarize changed files and anything not completed.

## Suggested Implementation Order

1. Add shared formatting helpers for statuses, priorities, project names, and assignee names.
2. Improve badges and table readability.
3. Improve dashboard stat cards and charts.
4. Improve sidebar and page headers.
5. Add delete/reset confirmation modals.
6. Add toast notifications.
7. Improve modals.
8. Improve responsive behavior.
