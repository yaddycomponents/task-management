// ============================================
// PRESENTATIONAL COMPONENT: TaskFilter
// Filter buttons for task status
// ============================================

import React from 'react';
import { Button } from '../common';

const filters = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export const TaskFilter = ({ currentFilter, onFilterChange }) => {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
      {filters.map(filter => (
        <Button
          key={filter.value}
          variant={currentFilter === filter.value ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default TaskFilter;
