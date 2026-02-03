// ============================================
// PRESENTATIONAL COMPONENT: TaskForm
// Form for creating/editing tasks
// Receives handlers via props
// ============================================

import React, { useState, useEffect } from 'react';
import { Button } from '../common';

export const TaskForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({ title: title.trim(), description: description.trim() });
    setTitle('');
    setDescription('');
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '12px',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 500,
    fontSize: '14px',
    color: '#374151',
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          style={inputStyle}
          required
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
