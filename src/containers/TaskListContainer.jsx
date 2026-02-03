import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Title,
  Group,
  Button,
  SegmentedControl,
  Card,
  Text,
  Badge,
  Stack,
  Modal,
  TextInput,
  Textarea,
  ActionIcon,
  Menu,
  Loader,
  Center,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  IconPlus,
  IconDots,
  IconEye,
  IconTrash,
  IconPlayerPlay,
  IconCheck,
} from '@tabler/icons-react';
import { useTasks, useUpdateTask, useDeleteTask, useCreateTask } from '../hooks/useTasks';
import { useAppContext } from '../context/AppContext';

const statusConfig = {
  todo: { label: 'To Do', color: 'yellow' },
  'in-progress': { label: 'In Progress', color: 'violet' },
  done: { label: 'Done', color: 'green' },
};

const TaskCard = ({ task, onStatusChange, onDelete, onView }) => {
  const statusOptions = ['todo', 'in-progress', 'done'];
  const currentIndex = statusOptions.indexOf(task.status);
  const nextStatus = statusOptions[currentIndex + 1];

  return (
    <Card withBorder padding="md">
      <Group justify="space-between" mb="xs">
        <Text fw={500}>{task.title}</Text>
        <Badge variant="light" color={statusConfig[task.status].color}>
          {statusConfig[task.status].label}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" mb="xs">
        {task.description}
      </Text>

      <Text size="xs" c="dimmed" mb="md">
        Created: {task.createdAt}
      </Text>

      <Group justify="space-between">
        <Group gap="xs">
          {nextStatus && (
            <Button
              variant="light"
              size="xs"
              leftSection={nextStatus === 'done' ? <IconCheck size={14} /> : <IconPlayerPlay size={14} />}
              onClick={() => onStatusChange(task.id, nextStatus)}
            >
              {nextStatus === 'in-progress' ? 'Start' : 'Complete'}
            </Button>
          )}
        </Group>

        <Menu shadow="md" width={150}>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEye size={14} />} onClick={() => onView(task.id)}>
              View Details
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => onDelete(task.id)}>
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Card>
  );
};

export const TaskListContainer = () => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();

  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  const { data: tasks, isLoading, error } = useTasks(statusFilter);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const createTask = useCreateTask();

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask.mutateAsync({ id: taskId, updates: { status: newStatus } });
      addNotification(`Task moved to ${statusConfig[newStatus].label}`, 'success');
    } catch (err) {
      addNotification('Failed to update task', 'error');
    }
  };

  const handleDelete = (taskId) => {
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
          await deleteTask.mutateAsync(taskId);
          addNotification('Task deleted', 'success');
        } catch (err) {
          addNotification('Failed to delete task', 'error');
        }
      },
    });
  };

  const handleViewDetails = (taskId) => navigate(`/tasks/${taskId}`);

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      await createTask.mutateAsync(newTask);
      setShowCreateModal(false);
      setNewTask({ title: '', description: '' });
      addNotification('Task created successfully', 'success');
    } catch (err) {
      addNotification('Failed to create task', 'error');
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title order={2} fw={600}>Tasks</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setShowCreateModal(true)}
        >
          New Task
        </Button>
      </Group>

      <SegmentedControl
        value={statusFilter}
        onChange={setStatusFilter}
        data={[
          { value: 'all', label: 'All' },
          { value: 'todo', label: 'To Do' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'done', label: 'Done' },
        ]}
      />

      {isLoading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : error ? (
        <Card withBorder>
          <Text c="red" ta="center">Error loading tasks: {error.message}</Text>
        </Card>
      ) : !tasks || tasks.length === 0 ? (
        <Card withBorder py="xl">
          <Text c="dimmed" ta="center">No tasks found. Create one to get started!</Text>
        </Card>
      ) : (
        <Stack gap="sm">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onView={handleViewDetails}
            />
          ))}
        </Stack>
      )}

      <Modal
        opened={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="Enter task title"
            required
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <Textarea
            label="Description"
            placeholder="Enter task description"
            rows={3}
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask} loading={createTask.isPending}>
              Create Task
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};

export default TaskListContainer;
