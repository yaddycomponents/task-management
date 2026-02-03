import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Title,
  Text,
  Card,
  Group,
  Stack,
  Button,
  Badge,
  Modal,
  TextInput,
  Textarea,
  SegmentedControl,
  Loader,
  Center,
  Divider,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconArrowLeft, IconEdit, IconTrash } from '@tabler/icons-react';
import { useTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { useAppContext } from '../context/AppContext';

const statusConfig = {
  todo: { label: 'To Do', color: 'yellow' },
  'in-progress': { label: 'In Progress', color: 'violet' },
  done: { label: 'Done', color: 'green' },
};

export const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useAppContext();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  const { data: task, isLoading, error } = useTask(id);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleUpdate = async (updates) => {
    try {
      await updateTask.mutateAsync({ id, updates });
      setShowEditModal(false);
      addNotification('Task updated successfully', 'success');
    } catch (err) {
      addNotification('Failed to update task', 'error');
    }
  };

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Delete Task',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this task? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteTask.mutateAsync(id);
          addNotification('Task deleted', 'success');
          navigate('/tasks');
        } catch (err) {
          addNotification('Failed to delete task', 'error');
        }
      },
    });
  };

  const handleStatusChange = (newStatus) => {
    handleUpdate({ status: newStatus });
  };

  const openEditModal = () => {
    if (task) {
      setEditForm({ title: task.title, description: task.description || '' });
    }
    setShowEditModal(true);
  };

  const handleEditSubmit = () => {
    if (!editForm.title.trim()) return;
    handleUpdate({ title: editForm.title.trim(), description: editForm.description.trim() });
  };

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (error || !task) {
    return (
      <Center py="xl">
        <Stack align="center" gap="md">
          <Text c="red">Task not found</Text>
          <Button variant="subtle" onClick={() => navigate('/tasks')}>
            Back to Tasks
          </Button>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate('/tasks')}
        w="fit-content"
      >
        Back to Tasks
      </Button>

      <Card withBorder>
        <Group justify="space-between" mb="md">
          <Title order={3}>{task.title}</Title>
          <Badge variant="light" color={statusConfig[task.status].color} size="lg">
            {statusConfig[task.status].label}
          </Badge>
        </Group>

        <Divider mb="md" />

        <Stack gap="md">
          <div>
            <Text size="sm" fw={500} c="dimmed" mb={4}>Description</Text>
            <Text>{task.description || 'No description provided'}</Text>
          </div>

          <div>
            <Text size="sm" fw={500} c="dimmed" mb={4}>Created</Text>
            <Text>{task.createdAt}</Text>
          </div>

          <div>
            <Text size="sm" fw={500} c="dimmed" mb={8}>Status</Text>
            <SegmentedControl
              value={task.status}
              onChange={handleStatusChange}
              data={[
                { value: 'todo', label: 'To Do' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'done', label: 'Done' },
              ]}
            />
          </div>
        </Stack>

        <Divider my="md" />

        <Group>
          <Button
            variant="light"
            leftSection={<IconEdit size={16} />}
            onClick={openEditModal}
          >
            Edit
          </Button>
          <Button
            variant="subtle"
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Group>
      </Card>

      <Modal
        opened={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Task"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="Enter task title"
            required
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          />
          <Textarea
            label="Description"
            placeholder="Enter task description"
            rows={3}
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} loading={updateTask.isPending}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default TaskDetailPage;
