import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Hook for user progress specifically
interface UserProgressData {
  totalGamesPlayed: number;
  totalWordsLearned: number;
  categoryProgress: Record<string, any>;
  achievements: string[];
  settings: {
    soundEnabled: boolean;
    difficultyPreference: 'auto' | 'manual';
  };
  lastPlayed: string | null;
}

export function useUserProgress() {
  const [progress, setProgress] = useLocalStorage<UserProgressData>('irish-game-progress', {
    totalGamesPlayed: 0,
    totalWordsLearned: 0,
    categoryProgress: {},
    achievements: [],
    settings: {
      soundEnabled: true,
      difficultyPreference: 'auto' as const,
    },
    lastPlayed: null,
  });

  const updateCategoryProgress = (categoryId: string, newProgress: any) => {
    setProgress((prev: UserProgressData) => ({
      ...prev,
      categoryProgress: {
        ...prev.categoryProgress,
        [categoryId]: {
          ...prev.categoryProgress[categoryId],
          ...newProgress,
        },
      },
      lastPlayed: new Date().toISOString(),
    }));
  };

  const incrementGamesPlayed = () => {
    setProgress((prev: UserProgressData) => ({
      ...prev,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      lastPlayed: new Date().toISOString(),
    }));
  };

  const addWordsLearned = (count: number) => {
    setProgress((prev: UserProgressData) => ({
      ...prev,
      totalWordsLearned: prev.totalWordsLearned + count,
    }));
  };

  return {
    progress,
    setProgress,
    updateCategoryProgress,
    incrementGamesPlayed,
    addWordsLearned,
  };
}