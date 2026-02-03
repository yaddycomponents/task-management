/**
 * EASTER EGG #2: Secret Achievements Page
 *
 * This page demonstrates:
 * - React.lazy() for code splitting
 * - Suspense for loading states
 * - Custom hooks consumption
 * - Render props pattern (see AchievementCard)
 *
 * How to find: Look at App.jsx routes or check console hint
 */

import React, { useEffect } from 'react';
import {
  Title,
  Text,
  Card,
  Stack,
  Group,
  Badge,
  Progress,
  Box,
  ThemeIcon,
  SimpleGrid,
} from '@mantine/core';
import { IconTrophy, IconLock } from '@tabler/icons-react';
import { useAchievements } from '../hooks/useAchievements';

// Render props pattern example
const AchievementCard = ({ achievement, unlocked, children }) => {
  // children can be a function (render prop)
  const renderContent = typeof children === 'function'
    ? children({ achievement, unlocked })
    : children;

  return (
    <Card
      withBorder
      padding="lg"
      style={{
        opacity: unlocked ? 1 : 0.5,
        transition: 'all 0.3s ease',
      }}
    >
      {renderContent || (
        <Group>
          <ThemeIcon
            size="xl"
            radius="md"
            variant={unlocked ? 'filled' : 'light'}
            color={unlocked ? 'violet' : 'gray'}
          >
            {unlocked ? (
              <span style={{ fontSize: '20px' }}>{achievement.icon}</span>
            ) : (
              <IconLock size={20} />
            )}
          </ThemeIcon>
          <div>
            <Text fw={500}>{achievement.name}</Text>
            <Text size="sm" c="dimmed">
              {unlocked ? achievement.description : '???'}
            </Text>
          </div>
        </Group>
      )}
    </Card>
  );
};

export const AchievementsPage = () => {
  const {
    achievements,
    stats,
    unlockExplorer,
    _allAchievements,
  } = useAchievements();

  // Unlock "Explorer" achievement when visiting this page
  useEffect(() => {
    unlockExplorer();
  }, [unlockExplorer]);

  const allAchievementsList = Object.values(_allAchievements);
  const unlockedIds = achievements.map(a => a.id);
  const progress = (achievements.length / allAchievementsList.length) * 100;

  return (
    <Stack gap="xl">
      <div>
        <Group gap="xs">
          <IconTrophy size={28} color="#7950f2" />
          <Title order={2}>Secret Achievements</Title>
        </Group>
        <Text c="dimmed" mt={4}>
          You found the hidden achievements page! 🎉
        </Text>
      </div>

      <Card withBorder>
        <Text fw={500} mb="xs">Progress</Text>
        <Progress value={progress} color="violet" size="lg" radius="md" />
        <Text size="sm" c="dimmed" mt="xs">
          {achievements.length} / {allAchievementsList.length} achievements unlocked
        </Text>
      </Card>

      <Card withBorder>
        <Text fw={500} mb="md">Your Stats</Text>
        <SimpleGrid cols={2}>
          <Box>
            <Text size="xl" fw={700} c="violet">{stats.tasksCreated}</Text>
            <Text size="sm" c="dimmed">Tasks Created</Text>
          </Box>
          <Box>
            <Text size="xl" fw={700} c="green">{stats.tasksCompleted}</Text>
            <Text size="sm" c="dimmed">Tasks Completed</Text>
          </Box>
        </SimpleGrid>
      </Card>

      <div>
        <Text fw={600} mb="md">All Achievements</Text>
        <Stack gap="sm">
          {allAchievementsList.map(achievement => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              unlocked={unlockedIds.includes(achievement.id)}
            />
          ))}
        </Stack>
      </div>

      {/* Hidden hint for CODE_READER achievement */}
      {/*
        HINT: To unlock the "Code Reader" achievement,
        call unlockCodeReader() from useAchievements hook
        in your browser console:

        1. Open React DevTools
        2. Find a component using useAchievements
        3. Or import the hook in console and call it

        Or simply add ?unlock=code_reader to the URL 😉
      */}
    </Stack>
  );
};

export default AchievementsPage;
