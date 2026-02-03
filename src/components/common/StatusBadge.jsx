// ============================================
// REUSABLE STATUS BADGE COMPONENT
// Demonstrates: Reusability with status mapping
// ============================================

import React from 'react';

const statusConfig = {
  todo: {
    label: 'To Do',
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  'in-progress': {
    label: 'In Progress',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  done: {
    label: 'Done',
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
};

export const StatusBadge = ({ status, style = {} }) => {
  const config = statusConfig[status] || statusConfig.todo;

  const badgeStyle = {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: config.backgroundColor,
    color: config.color,
    ...style,
  };

  return <span style={badgeStyle}>{config.label}</span>;
};

export default StatusBadge;
