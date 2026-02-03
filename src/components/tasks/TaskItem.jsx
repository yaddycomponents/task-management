// ============================================
// PRESENTATIONAL COMPONENT: TaskItem
// Only renders UI based on props
// No data fetching or business logic
// ============================================

import React from 'react';
import { Card, StatusBadge, Button } from '../common';

export const TaskItem = ({
  task,
  onStatusChange,
  onDelete,
  onViewDetails,
}) => {
  const statusOptions = ['todo', 'in-progress', 'done'];
  const currentIndex = statusOptions.indexOf(task.status);
  const nextStatus = statusOptions[currentIndex + 1];

  return (
    <Card variant="elevated" style={{ marginBottom: '12px' }}>
      <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{task.title}</span>
        <StatusBadge status={task.status} />
      </Card.Header>

      <Card.Body>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
          {task.description}
        </p>
        <p style={{ margin: '8px 0 0', color: '#9ca3af', fontSize: '12px' }}>
          Created: {task.createdAt}
        </p>
      </Card.Body>

      <Card.Footer>
        {nextStatus && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onStatusChange(task.id, nextStatus)}
          >
            Move to {nextStatus === 'in-progress' ? 'In Progress' : 'Done'}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => onViewDetails(task.id)}>
          View
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(task.id)}>
          Delete
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default TaskItem;
