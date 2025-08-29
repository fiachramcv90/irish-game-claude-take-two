import { useState, useEffect } from 'react';
import type { Category, CategoryProgress } from '../types/irish.types';
import { useUserProgress } from './useLocalStorage';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  getCategoryProgress: (categoryId: string) => CategoryProgress;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { progress } = useUserProgress();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/data/categories.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load categories: ${response.status}`);
        }
        
        const data = await response.json();
        setCategories(data.categories);
        
      } catch (err) {
        console.error('Error loading categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const getCategoryProgress = (categoryId: string): CategoryProgress => {
    const categoryData = progress.categoryProgress[categoryId];
    
    if (!categoryData) {
      // Return default progress for new categories
      return {
        categoryId,
        unlockedWords: [],
        masteredWords: [],
        currentLevel: 1,
        bestScore: 0,
        totalPlayTime: 0,
        gamesPlayed: 0,
        averageAccuracy: 0,
        lastPlayed: new Date(),
      };
    }
    
    return {
      categoryId,
      unlockedWords: categoryData.unlockedWords || [],
      masteredWords: categoryData.masteredWords || [],
      currentLevel: categoryData.currentLevel || 1,
      bestScore: categoryData.bestScore || 0,
      totalPlayTime: categoryData.totalPlayTime || 0,
      gamesPlayed: categoryData.gamesPlayed || 0,
      averageAccuracy: categoryData.averageAccuracy || 0,
      lastPlayed: categoryData.lastPlayed ? new Date(categoryData.lastPlayed) : new Date(),
    };
  };

  return {
    categories,
    loading,
    error,
    getCategoryProgress,
  };
};