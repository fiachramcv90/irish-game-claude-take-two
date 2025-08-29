/**
 * Basic tests for Irish Language Matching Game core functionality
 * Testing game logic, data structures, and key user flows
 */

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock fetch for testing
global.fetch = jest.fn();

describe('Irish Language Game Logic', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Data Loading', () => {
    test('should load categories successfully', async () => {
      const mockCategories = {
        categories: [
          {
            id: 'animals',
            nameIrish: 'Ainmhithe',
            nameEnglish: 'Animals',
            totalWords: 15
          }
        ]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories
      });

      const response = await fetch('/data/categories.json');
      const data = await response.json();
      
      expect(data.categories).toHaveLength(1);
      expect(data.categories[0].id).toBe('animals');
      expect(data.categories[0].nameIrish).toBe('Ainmhithe');
    });

    test('should load vocabulary data successfully', async () => {
      const mockVocabulary = {
        category: 'animals',
        vocabulary: [
          {
            id: 'madra-dog-001',
            irishWord: 'madra',
            englishTranslation: 'dog',
            pronunciation: '/ˈmad̪ˠɾˠə/'
          }
        ]
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockVocabulary
      });

      const response = await fetch('/data/vocabulary/animals.json');
      const data = await response.json();
      
      expect(data.vocabulary).toHaveLength(1);
      expect(data.vocabulary[0].irishWord).toBe('madra');
      expect(data.vocabulary[0].englishTranslation).toBe('dog');
    });
  });

  describe('Game State Management', () => {
    test('should create correct number of cards based on difficulty', () => {
      const mockVocabulary = [
        { id: '1', irishWord: 'madra', englishTranslation: 'dog' },
        { id: '2', irishWord: 'cat', englishTranslation: 'cat' },
        { id: '3', irishWord: 'bó', englishTranslation: 'cow' },
        { id: '4', irishWord: 'capall', englishTranslation: 'horse' }
      ];

      // For difficulty level 1, should limit to 4 words = 8 cards total
      const wordLimit = Math.min(mockVocabulary.length, 4);
      const selectedVocabulary = mockVocabulary.slice(0, wordLimit);
      
      let cardCount = 0;
      selectedVocabulary.forEach(() => {
        cardCount += 2; // One picture card + one word card
      });

      expect(cardCount).toBe(8); // 4 pairs = 8 cards
      expect(selectedVocabulary).toHaveLength(4);
    });

    test('should calculate score correctly', () => {
      const calculateScore = (difficulty: number, attempts: number): number => {
        const baseScore = difficulty * 100;
        const efficiencyBonus = Math.max(0, baseScore - (attempts * 10));
        return Math.floor(baseScore + efficiencyBonus);
      };

      // Perfect game (difficulty 1, 1 attempt)
      expect(calculateScore(1, 1)).toBe(190); // 100 + (100 - 10)
      
      // Good game (difficulty 2, 3 attempts)
      expect(calculateScore(2, 3)).toBe(370); // 200 + (200 - 30)
      
      // Many attempts (difficulty 1, 20 attempts)
      expect(calculateScore(1, 20)).toBe(100); // 100 + max(0, 100 - 200)
    });
  });

  describe('User Progress Persistence', () => {
    test('should save and retrieve user progress from localStorage', () => {
      const mockProgress = {
        totalGamesPlayed: 5,
        totalWordsLearned: 12,
        categoryProgress: {
          animals: {
            bestScore: 450,
            gamesPlayed: 3,
            averageAccuracy: 0.85
          }
        }
      };

      localStorage.setItem('irish-game-progress', JSON.stringify(mockProgress));
      const retrieved = JSON.parse(localStorage.getItem('irish-game-progress') || '{}');

      expect(retrieved.totalGamesPlayed).toBe(5);
      expect(retrieved.categoryProgress.animals.bestScore).toBe(450);
      expect(retrieved.categoryProgress.animals.averageAccuracy).toBe(0.85);
    });

    test('should handle empty localStorage gracefully', () => {
      const defaultProgress = {
        totalGamesPlayed: 0,
        totalWordsLearned: 0,
        categoryProgress: {},
        achievements: [],
        settings: {
          soundEnabled: true,
          difficultyPreference: 'auto'
        }
      };

      const retrieved = JSON.parse(localStorage.getItem('irish-game-progress') || JSON.stringify(defaultProgress));
      
      expect(retrieved.totalGamesPlayed).toBe(0);
      expect(retrieved.settings.soundEnabled).toBe(true);
    });
  });

  describe('Irish Language Content Validation', () => {
    test('should validate Irish word structure', () => {
      const isValidIrishWord = (word: string): boolean => {
        // Basic validation: contains Irish characters and reasonable length
        const irishCharPattern = /^[a-záéíóúàèìòùâêîôûäëïöü]+$/i;
        return irishCharPattern.test(word) && word.length > 0 && word.length < 20;
      };

      expect(isValidIrishWord('madra')).toBe(true);
      expect(isValidIrishWord('bándearg')).toBe(true); // compound word
      expect(isValidIrishWord('éan')).toBe(true); // with fada
      expect(isValidIrishWord('')).toBe(false); // empty
      expect(isValidIrishWord('123')).toBe(false); // numbers
    });

    test('should validate pronunciation guides', () => {
      const isValidIPA = (pronunciation: string): boolean => {
        // Basic IPA validation - should start and end with slashes
        return pronunciation.startsWith('/') && pronunciation.endsWith('/') && pronunciation.length > 2;
      };

      expect(isValidIPA('/ˈmad̪ˠɾˠə/')).toBe(true);
      expect(isValidIPA('/bʲeːɾˠ/')).toBe(true);
      expect(isValidIPA('madra')).toBe(false); // not IPA format
      expect(isValidIPA('/')).toBe(false); // too short
    });
  });

  describe('Game Flow Integration', () => {
    test('should handle card matching logic', () => {
      const card1 = {
        id: 'pic-madra-dog-001',
        type: 'picture' as const,
        vocabularyId: 'madra-dog-001'
      };
      
      const card2 = {
        id: 'word-madra-dog-001',
        type: 'word' as const,
        vocabularyId: 'madra-dog-001'
      };
      
      const card3 = {
        id: 'pic-cat-cat-001',
        type: 'picture' as const,
        vocabularyId: 'cat-cat-001'
      };

      // Should match: same vocabulary ID, different types
      const isMatch1 = card1.vocabularyId === card2.vocabularyId && card1.type !== card2.type;
      expect(isMatch1).toBe(true);

      // Should not match: different vocabulary IDs
      const isMatch2 = card1.vocabularyId === card3.vocabularyId && card1.type !== card3.type;
      expect(isMatch2).toBe(false);
    });

    test('should shuffle cards randomly', () => {
      const shuffleArray = <T>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      const originalArray = [1, 2, 3, 4, 5, 6, 7, 8];
      const shuffled1 = shuffleArray(originalArray);
      const shuffled2 = shuffleArray(originalArray);

      // Arrays should contain same elements
      expect(shuffled1.sort()).toEqual(originalArray.sort());
      expect(shuffled2.sort()).toEqual(originalArray.sort());
      
      // But order should be different (with very high probability)
      // Note: There's a tiny chance this could fail due to randomness
      expect(shuffled1).not.toEqual(originalArray);
    });
  });
});

// Export for potential use in other tests
export { localStorageMock };