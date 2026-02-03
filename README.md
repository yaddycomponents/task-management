# TaskFlow

A modern task management app built with React and Mantine UI.

![React](https://img.shields.io/badge/React-18-blue)
![Mantine](https://img.shields.io/badge/Mantine-7-violet)
![Vite](https://img.shields.io/badge/Vite-5-yellow)

## Tech Stack

- **React 18** - UI library
- **Mantine 7** - Component library
- **React Query** - Server state management
- **React Router 6** - Navigation
- **Tabler Icons** - Icon set

## Features

- Create, edit, delete tasks
- Filter by status (To Do, In Progress, Done)
- Dashboard with task overview
- Confirmation modals
- Toast notifications

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── api/          # API service layer (swap with real API)
├── containers/   # Container components with logic
├── context/      # React Context (user, notifications)
├── hooks/        # React Query hooks
├── pages/        # Route pages
└── App.jsx       # Providers & routing
```

## Patterns Demonstrated

| Pattern | Location |
|---------|----------|
| Container/Presentational | `containers/TaskListContainer.jsx` |
| React Context | `context/AppContext.jsx` |
| Custom Hooks | `hooks/useTasks.js` |
| React Query | `hooks/useTasks.js` |

## API Integration

Currently uses mock data. To connect real API, update `src/api/taskApi.js`:

```js
export const fetchTasks = async () => {
  const response = await fetch('/api/tasks');
  return response.json();
};
```
# task-management
