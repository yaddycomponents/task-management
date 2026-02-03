// ============================================
// PRESENTATIONAL COMPONENT: TaskList
// Renders a list of TaskItems
// No data fetching - receives everything via props
// ============================================

import React from 'react';
import { TaskItem } from './TaskItem';

export const TaskList = ({
  tasks,
  isLoading,
  error,
  onStatusChange,
  onDelete,
  onViewDetails,
}) => {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        Loading tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
        Error loading tasks: {error.message}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        No tasks found. Create one to get started!
      </div>
    );
  }

  return (
    <div>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default TaskList;
