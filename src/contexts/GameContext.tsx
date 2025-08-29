import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { 
  GameStatus, 
  Card, 
  VocabularyItem, 
  Category, 
  GameProgress, 
  DifficultyLevel,
  CategoryData 
} from '../types/irish.types';
import { useUserProgress } from '../hooks/useLocalStorage';

interface GameState {
  currentCategory: Category | null;
  vocabulary: VocabularyItem[];
  cards: Card[];
  gameStatus: GameStatus;
  selectedCards: string[];
  matchedPairs: string[];
  attempts: number;
  score: number;
  timeElapsed: number;
  gameStartTime: Date | null;
  progress: GameProgress | null;
  difficulty: DifficultyLevel;
  error: string | null;
}

type GameAction = 
  | { type: 'INITIALIZE_GAME'; payload: { category: Category; vocabulary: VocabularyItem[] } }
  | { type: 'START_GAME' }
  | { type: 'SELECT_CARD'; payload: { cardId: string } }
  | { type: 'MATCH_SUCCESS'; payload: { card1Id: string; card2Id: string } }
  | { type: 'MATCH_FAILURE'; payload: { card1Id: string; card2Id: string } }
  | { type: 'COMPLETE_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'SET_ERROR'; payload: { error: string | null } }
  | { type: 'UPDATE_TIME'; payload: { timeElapsed: number } }
  | { type: 'SET_DIFFICULTY'; payload: { difficulty: DifficultyLevel } };

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  initializeGame: (categoryId: string) => Promise<void>;
  selectCard: (cardId: string) => void;
  resetGame: () => void;
  setDifficulty: (difficulty: DifficultyLevel) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialState: GameState = {
  currentCategory: null,
  vocabulary: [],
  cards: [],
  gameStatus: 'ready',
  selectedCards: [],
  matchedPairs: [],
  attempts: 0,
  score: 0,
  timeElapsed: 0,
  gameStartTime: null,
  progress: null,
  difficulty: 1,
  error: null,
};

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INITIALIZE_GAME': {
      const { category, vocabulary } = action.payload;
      
      // Create cards for the selected vocabulary
      const wordLimit = Math.min(vocabulary.length, getWordLimitForDifficulty(state.difficulty));
      const selectedVocabulary = vocabulary.slice(0, wordLimit);
      
      const cards: Card[] = [];
      selectedVocabulary.forEach((vocab, index) => {
        // Picture card
        cards.push({
          id: `pic-${vocab.id}`,
          type: 'picture',
          vocabularyId: vocab.id,
          position: index * 2,
          isSelected: false,
          isMatched: false,
          isVisible: true,
        });
        
        // Word card
        cards.push({
          id: `word-${vocab.id}`,
          type: 'word',
          vocabularyId: vocab.id,
          position: index * 2 + 1,
          isSelected: false,
          isMatched: false,
          isVisible: true,
        });
      });
      
      // Shuffle cards
      const shuffledCards = shuffleArray(cards).map((card, index) => ({
        ...card,
        position: index,
      }));
      
      return {
        ...state,
        currentCategory: category,
        vocabulary: selectedVocabulary,
        cards: shuffledCards,
        gameStatus: 'starting',
        selectedCards: [],
        matchedPairs: [],
        attempts: 0,
        score: 0,
        timeElapsed: 0,
        gameStartTime: new Date(),
        error: null,
      };
    }
    
    case 'START_GAME': {
      return {
        ...state,
        gameStatus: 'playing',
        gameStartTime: new Date(),
      };
    }
    
    case 'SELECT_CARD': {
      const { cardId } = action.payload;
      
      if (state.gameStatus !== 'playing') return state;
      
      const card = state.cards.find(c => c.id === cardId);
      if (!card || card.isMatched || state.selectedCards.includes(cardId)) {
        return state;
      }
      
      const newSelectedCards = [...state.selectedCards, cardId];
      
      if (newSelectedCards.length === 2) {
        return {
          ...state,
          selectedCards: newSelectedCards,
          gameStatus: 'checking',
          attempts: state.attempts + 1,
        };
      }
      
      return {
        ...state,
        selectedCards: newSelectedCards,
      };
    }
    
    case 'MATCH_SUCCESS': {
      const { card1Id, card2Id } = action.payload;
      const newMatchedPairs = [...state.matchedPairs, card1Id, card2Id];
      const scoreIncrease = calculateScore(state.difficulty, state.attempts);
      
      // Check if game is completed
      const isCompleted = newMatchedPairs.length === state.cards.length;
      
      return {
        ...state,
        selectedCards: [],
        matchedPairs: newMatchedPairs,
        score: state.score + scoreIncrease,
        gameStatus: isCompleted ? 'completed' : 'celebrating',
      };
    }
    
    case 'MATCH_FAILURE': {
      return {
        ...state,
        selectedCards: [],
        gameStatus: 'correcting',
      };
    }
    
    case 'COMPLETE_GAME': {
      return {
        ...state,
        gameStatus: 'completed',
      };
    }
    
    case 'RESET_GAME': {
      return {
        ...initialState,
        difficulty: state.difficulty,
      };
    }
    
    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload.error,
        gameStatus: 'error',
      };
    }
    
    case 'UPDATE_TIME': {
      return {
        ...state,
        timeElapsed: action.payload.timeElapsed,
      };
    }
    
    case 'SET_DIFFICULTY': {
      return {
        ...state,
        difficulty: action.payload.difficulty,
      };
    }
    
    default:
      return state;
  }
}

function getWordLimitForDifficulty(difficulty: DifficultyLevel): number {
  switch (difficulty) {
    case 1: return 4;  // 8 cards total
    case 2: return 6;  // 12 cards total
    case 3: return 8;  // 16 cards total
    case 4: return 10; // 20 cards total
    case 5: return 12; // 24 cards total
    default: return 4;
  }
}

function calculateScore(difficulty: DifficultyLevel, attempts: number): number {
  const baseScore = difficulty * 100;
  const efficiencyBonus = Math.max(0, baseScore - (attempts * 10));
  return Math.floor(baseScore + efficiencyBonus);
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { updateCategoryProgress, incrementGamesPlayed, addWordsLearned } = useUserProgress();
  
  // Timer effect
  useEffect(() => {
    let interval: number;
    
    if (state.gameStatus === 'playing' && state.gameStartTime) {
      interval = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.gameStartTime!.getTime()) / 1000);
        dispatch({ type: 'UPDATE_TIME', payload: { timeElapsed: elapsed } });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.gameStatus, state.gameStartTime]);
  
  // Handle match checking
  useEffect(() => {
    if (state.gameStatus === 'checking' && state.selectedCards.length === 2) {
      const [card1Id, card2Id] = state.selectedCards;
      const card1 = state.cards.find(c => c.id === card1Id);
      const card2 = state.cards.find(c => c.id === card2Id);
      
      if (card1 && card2) {
        const isMatch = card1.vocabularyId === card2.vocabularyId && card1.type !== card2.type;
        
        const timer = setTimeout(() => {
          if (isMatch) {
            dispatch({ type: 'MATCH_SUCCESS', payload: { card1Id, card2Id } });
          } else {
            dispatch({ type: 'MATCH_FAILURE', payload: { card1Id, card2Id } });
          }
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [state.gameStatus, state.selectedCards, state.cards]);
  
  // Auto-transition from celebrating/correcting back to playing
  useEffect(() => {
    if (state.gameStatus === 'celebrating' || state.gameStatus === 'correcting') {
      const timer = setTimeout(() => {
        if (state.gameStatus === 'celebrating' && state.matchedPairs.length === state.cards.length) {
          dispatch({ type: 'COMPLETE_GAME' });
        } else {
          dispatch({ type: 'START_GAME' });
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [state.gameStatus, state.matchedPairs.length, state.cards.length]);
  
  // Save progress when game completes
  useEffect(() => {
    if (state.gameStatus === 'completed' && state.currentCategory) {
      const categoryId = state.currentCategory.id;
      const accuracy = state.attempts > 0 ? (state.matchedPairs.length / 2) / state.attempts : 0;
      const wordsLearned = state.matchedPairs.length / 2;
      
      // Update category progress
      updateCategoryProgress(categoryId, {
        bestScore: Math.max(state.score, 0), // Will be merged with existing best score
        gamesPlayed: 1, // Will be incremented
        averageAccuracy: accuracy,
        totalPlayTime: state.timeElapsed,
        lastPlayed: new Date().toISOString(),
        unlockedWords: state.vocabulary.map(v => v.id), // Mark all played words as unlocked
      });
      
      // Update global progress
      incrementGamesPlayed();
      addWordsLearned(wordsLearned);
    }
  }, [state.gameStatus, state.currentCategory, state.score, state.attempts, state.matchedPairs.length, state.timeElapsed, state.vocabulary, updateCategoryProgress, incrementGamesPlayed, addWordsLearned]);
  
  const initializeGame = async (categoryId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_ERROR', payload: { error: null } });
      
      // Load category data
      const categoryResponse = await fetch('/data/categories.json');
      const categoryData = await categoryResponse.json();
      const category = categoryData.categories.find((c: Category) => c.id === categoryId);
      
      if (!category) {
        throw new Error(`Category ${categoryId} not found`);
      }
      
      // Load vocabulary data
      const vocabularyResponse = await fetch(`/data/vocabulary/${categoryId}.json`);
      const vocabularyData: CategoryData = await vocabularyResponse.json();
      
      dispatch({ 
        type: 'INITIALIZE_GAME', 
        payload: { 
          category, 
          vocabulary: vocabularyData.vocabulary 
        } 
      });
      
      // Start the game after a brief delay
      setTimeout(() => {
        dispatch({ type: 'START_GAME' });
      }, 1000);
      
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: { 
          error: error instanceof Error ? error.message : 'Failed to load game data' 
        } 
      });
    }
  };
  
  const selectCard = (cardId: string) => {
    dispatch({ type: 'SELECT_CARD', payload: { cardId } });
  };
  
  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };
  
  const setDifficulty = (difficulty: DifficultyLevel) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: { difficulty } });
  };
  
  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      initializeGame,
      selectCard,
      resetGame,
      setDifficulty,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};