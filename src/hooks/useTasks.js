// ============================================
// REACT QUERY HOOKS
// Demonstrates: Server state management with React Query
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as taskApi from '../api/taskApi';

// Query keys
export const taskKeys = {
  all: ['tasks'],
  lists: () => [...taskKeys.all, 'list'],
  list: (filters) => [...taskKeys.lists(), filters],
  details: () => [...taskKeys.all, 'detail'],
  detail: (id) => [...taskKeys.details(), id],
};

// Fetch all tasks
export const useTasks = (statusFilter = 'all') => {
  return useQuery({
    queryKey: taskKeys.list(statusFilter),
    queryFn: () => taskApi.fetchTasks(statusFilter),
  });
};

// Fetch single task
export const useTask = (id) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskApi.fetchTaskById(id),
    enabled: !!id,
  });
};

// Create task mutation
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

// Update task mutation
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => taskApi.updateTask(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(data.id) });
    },
  });
};

// Delete task mutation
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};
