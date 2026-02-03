/**
 * EASTER EGG #1: useReducer with State Machine Pattern
 *
 * This hook demonstrates:
 * - useReducer for complex state
 * - State machine pattern (finite states + transitions)
 * - Discriminated unions for actions
 * - Persist to localStorage
 *
 * Interns who find this should understand:
 * - When useReducer > useState
 * - State machines prevent impossible states
 * - Action creators pattern
 */

import { useReducer, useEffect, useCallback } from 'react';

// Achievement definitions
const ACHIEVEMENTS = {
  FIRST_TASK: { id: 'first_task', name: 'First Steps', description: 'Create your first task', icon: '🎯' },
  TASK_MASTER: { id: 'task_master', name: 'Task Master', description: 'Complete 5 tasks', icon: '⭐' },
  SPEED_DEMON: { id: 'speed_demon', name: 'Speed Demon', description: 'Complete a task within 1 minute of creating it', icon: '⚡' },
  EXPLORER: { id: 'explorer', name: 'Explorer', description: 'You found the secret achievements system!', icon: '🔍' },
  CODE_READER: { id: 'code_reader', name: 'Code Reader', description: 'You read the source code!', icon: '👀' },
};

// State machine states
const STATES = {
  IDLE: 'idle',
  UNLOCKING: 'unlocking',
  CELEBRATING: 'celebrating',
};

// Initial state
const initialState = {
  status: STATES.IDLE,
  unlockedAchievements: [],
  tasksCreated: 0,
  tasksCompleted: 0,
  lastTaskCreatedAt: null,
};

// Reducer with state machine logic
function achievementReducer(state, action) {
  switch (action.type) {
    case 'TASK_CREATED': {
      const newTasksCreated = state.tasksCreated + 1;
      const achievements = [...state.unlockedAchievements];

      // Check for FIRST_TASK achievement
      if (newTasksCreated === 1 && !achievements.includes('first_task')) {
        achievements.push('first_task');
      }

      return {
        ...state,
        status: achievements.length > state.unlockedAchievements.length ? STATES.UNLOCKING : STATES.IDLE,
        tasksCreated: newTasksCreated,
        lastTaskCreatedAt: Date.now(),
        unlockedAchievements: achievements,
      };
    }

    case 'TASK_COMPLETED': {
      const newTasksCompleted = state.tasksCompleted + 1;
      const achievements = [...state.unlockedAchievements];

      // Check for TASK_MASTER achievement
      if (newTasksCompleted >= 5 && !achievements.includes('task_master')) {
        achievements.push('task_master');
      }

      // Check for SPEED_DEMON achievement
      if (state.lastTaskCreatedAt && Date.now() - state.lastTaskCreatedAt < 60000) {
        if (!achievements.includes('speed_demon')) {
          achievements.push('speed_demon');
        }
      }

      return {
        ...state,
        status: achievements.length > state.unlockedAchievements.length ? STATES.UNLOCKING : STATES.IDLE,
        tasksCompleted: newTasksCompleted,
        unlockedAchievements: achievements,
      };
    }

    case 'UNLOCK_EXPLORER': {
      if (state.unlockedAchievements.includes('explorer')) return state;
      return {
        ...state,
        status: STATES.UNLOCKING,
        unlockedAchievements: [...state.unlockedAchievements, 'explorer'],
      };
    }

    case 'UNLOCK_CODE_READER': {
      if (state.unlockedAchievements.includes('code_reader')) return state;
      return {
        ...state,
        status: STATES.UNLOCKING,
        unlockedAchievements: [...state.unlockedAchievements, 'code_reader'],
      };
    }

    case 'CELEBRATION_COMPLETE': {
      return { ...state, status: STATES.IDLE };
    }

    case 'HYDRATE': {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
}

// Custom hook
export function useAchievements() {
  const [state, dispatch] = useReducer(achievementReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('taskflow_achievements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'HYDRATE', payload: parsed });
      } catch (e) {
        // Invalid data, ignore
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('taskflow_achievements', JSON.stringify({
      unlockedAchievements: state.unlockedAchievements,
      tasksCreated: state.tasksCreated,
      tasksCompleted: state.tasksCompleted,
    }));
  }, [state.unlockedAchievements, state.tasksCreated, state.tasksCompleted]);

  // Action creators (memoized)
  const trackTaskCreated = useCallback(() => dispatch({ type: 'TASK_CREATED' }), []);
  const trackTaskCompleted = useCallback(() => dispatch({ type: 'TASK_COMPLETED' }), []);
  const unlockExplorer = useCallback(() => dispatch({ type: 'UNLOCK_EXPLORER' }), []);
  const unlockCodeReader = useCallback(() => dispatch({ type: 'UNLOCK_CODE_READER' }), []);
  const celebrationComplete = useCallback(() => dispatch({ type: 'CELEBRATION_COMPLETE' }), []);

  return {
    // State
    achievements: state.unlockedAchievements.map(id => ACHIEVEMENTS[id.toUpperCase()]),
    isUnlocking: state.status === STATES.UNLOCKING,
    stats: {
      tasksCreated: state.tasksCreated,
      tasksCompleted: state.tasksCompleted,
    },

    // Actions
    trackTaskCreated,
    trackTaskCompleted,
    unlockExplorer,
    unlockCodeReader,
    celebrationComplete,

    // Meta (for curious devs)
    _allAchievements: ACHIEVEMENTS,
    _hint: 'Try visiting /achievements 👀',
  };
}

// Console Easter egg - only in development
if (typeof window !== 'undefined') {
  console.log(
    '%c🔍 Hey curious developer!',
    'font-size: 16px; font-weight: bold; color: #7950f2;'
  );
  console.log(
    '%cThere are hidden achievements in this app. Check out useAchievements.js and try /achievements',
    'font-size: 12px; color: #868e96;'
  );
}
