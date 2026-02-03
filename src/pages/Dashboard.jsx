import React from 'react';
import { Link } from 'react-router-dom';
import {
  Title,
  Text,
  Card,
  SimpleGrid,
  Group,
  Button,
  Stack,
  Badge,
  Box,
} from '@mantine/core';
import { IconArrowRight, IconCircleCheck, IconClock, IconList } from '@tabler/icons-react';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../context/AuthContext';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const StatCard = ({ label, value, color, icon: Icon }) => (
  <Card withBorder padding="lg">
    <Group justify="space-between" align="flex-start">
      <div>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>{label}</Text>
        <Text size="xl" fw={700} mt={4} c={color}>{value}</Text>
      </div>
      <Icon size={24} color={color === 'dimmed' ? '#868e96' : color} stroke={1.5} />
    </Group>
  </Card>
);

export const Dashboard = () => {
  const { user } = useAuth();
  const { data: tasks = [] } = useTasks();

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  const recentTasks = tasks.filter(t => t.status !== 'done').slice(0, 4);

  return (
    <Stack gap="xl">
      <div>
        <Title order={2} fw={600}>
          {getGreeting()}, {user.name.split(' ')[0]}
        </Title>
        <Text c="dimmed" mt={4}>
          You have <Text span fw={600} c="dark">{stats.todo + stats.inProgress}</Text> tasks pending
        </Text>
      </div>

      <SimpleGrid cols={{ base: 2, sm: 4 }}>
        <StatCard label="Total" value={stats.total} color="dimmed" icon={IconList} />
        <StatCard label="To Do" value={stats.todo} color="#fab005" icon={IconClock} />
        <StatCard label="In Progress" value={stats.inProgress} color="#7950f2" icon={IconClock} />
        <StatCard label="Completed" value={stats.done} color="#40c057" icon={IconCircleCheck} />
      </SimpleGrid>

      <Card withBorder padding={0}>
        <Group justify="space-between" p="md" style={{ borderBottom: '1px solid #e9ecef' }}>
          <Text fw={600}>Upcoming Tasks</Text>
          <Button
            component={Link}
            to="/tasks"
            variant="subtle"
            size="xs"
            rightSection={<IconArrowRight size={14} />}
          >
            View All
          </Button>
        </Group>

        {recentTasks.length === 0 ? (
          <Box p="xl" ta="center">
            <Text c="dimmed">No pending tasks. You're all caught up!</Text>
          </Box>
        ) : (
          <Stack gap={0}>
            {recentTasks.map((task, index) => (
              <Link
                key={task.id}
                to={`/tasks/${task.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Group
                  justify="space-between"
                  p="md"
                  style={{
                    borderBottom: index < recentTasks.length - 1 ? '1px solid #e9ecef' : 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                  className="task-row"
                >
                  <div>
                    <Text fw={500} size="sm">{task.title}</Text>
                    <Text size="xs" c="dimmed" mt={2}>{task.description}</Text>
                  </div>
                  <Badge
                    variant="light"
                    color={task.status === 'in-progress' ? 'violet' : 'yellow'}
                  >
                    {task.status === 'in-progress' ? 'In Progress' : 'To Do'}
                  </Badge>
                </Group>
              </Link>
            ))}
          </Stack>
        )}
      </Card>
    </Stack>
  );
};

export default Dashboard;
