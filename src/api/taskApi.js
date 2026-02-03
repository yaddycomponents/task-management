let tasks = [
  { id: 1, title: 'Review Q1 marketing proposal', description: 'Go through the marketing deck and provide feedback by EOD', status: 'done', createdAt: '2025-01-28', priority: 'high' },
  { id: 2, title: 'Fix checkout page bug', description: 'Users reporting payment button not responding on mobile Safari', status: 'in-progress', createdAt: '2025-01-30', priority: 'high' },
  { id: 3, title: 'Prepare client presentation', description: 'Create slides for the Acme Corp project kickoff meeting on Friday', status: 'in-progress', createdAt: '2025-02-01', priority: 'medium' },
  { id: 4, title: 'Update user documentation', description: 'Add new features from v2.3 release to the help center', status: 'todo', createdAt: '2025-02-02', priority: 'low' },
  { id: 5, title: 'Schedule team retrospective', description: 'Book meeting room and send calendar invites for sprint retro', status: 'todo', createdAt: '2025-02-03', priority: 'medium' },
  { id: 6, title: 'Review pull requests', description: 'Check pending PRs from the frontend team before release', status: 'todo', createdAt: '2025-02-03', priority: 'high' },
];

let nextId = 7;

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// GET all tasks
export const fetchTasks = async (statusFilter = null) => {
  await delay(300);

  // TODO: Replace with actual API call
  // return fetch('/api/tasks').then(res => res.json());

  if (statusFilter && statusFilter !== 'all') {
    return tasks.filter(task => task.status === statusFilter);
  }
  return [...tasks];
};

// GET single task
export const fetchTaskById = async (id) => {
  await delay(200);

  // TODO: Replace with actual API call
  // return fetch(`/api/tasks/${id}`).then(res => res.json());

  const task = tasks.find(t => t.id === Number(id));
  if (!task) throw new Error('Task not found');
  return task;
};

// POST create task
export const createTask = async (taskData) => {
  await delay(300);

  // TODO: Replace with actual API call
  // return fetch('/api/tasks', { method: 'POST', body: JSON.stringify(taskData) }).then(res => res.json());

  const newTask = {
    id: nextId++,
    ...taskData,
    status: 'todo',
    createdAt: new Date().toISOString().split('T')[0],
  };
  tasks.push(newTask);
  return newTask;
};

// PUT update task
export const updateTask = async (id, updates) => {
  await delay(300);

  // TODO: Replace with actual API call
  // return fetch(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(updates) }).then(res => res.json());

  const index = tasks.findIndex(t => t.id === Number(id));
  if (index === -1) throw new Error('Task not found');

  tasks[index] = { ...tasks[index], ...updates };
  return tasks[index];
};

// DELETE task
export const deleteTask = async (id) => {
  await delay(300);

  // TODO: Replace with actual API call
  // return fetch(`/api/tasks/${id}`, { method: 'DELETE' });

  const index = tasks.findIndex(t => t.id === Number(id));
  if (index === -1) throw new Error('Task not found');

  tasks.splice(index, 1);
  return { success: true };
};
