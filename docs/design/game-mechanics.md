# Game Mechanics & Logic Design

**Phase**: 2 - Design & Architecture  
**Agent**: Game Logic Agent  
**Date**: 2024-08-29  
**Status**: Core Mechanics Defined

---

## Game Flow Overview

### Core Game Loop
```
Start Game → Load Category → Shuffle Cards → Display Board → 
Player Selection → Validate Match → Update Score → 
Check Completion → End Game or Continue
```

### Session Structure
1. **Category Selection**: Player chooses vocabulary category
2. **Difficulty Setting**: Auto-determined or player-selected
3. **Game Initialization**: Load vocabulary, shuffle cards, start timer
4. **Gameplay Loop**: Card selection and matching validation
5. **Progress Tracking**: Score, accuracy, time tracking
6. **Session End**: Results display, progress saving, next steps

---

## Core Matching Mechanics

### Card Pairing System

#### Basic Matching Logic
```typescript
interface Card {
  id: string;
  type: 'picture' | 'word';
  vocabularyId: string; // Links to VocabularyItem
  position: number;     // Board position (0-15 for 4x4 grid)
  isSelected: boolean;
  isMatched: boolean;
  isVisible: boolean;
}

interface MatchPair {
  pictureCard: Card;
  wordCard: Card;
  vocabularyItem: VocabularyItem;
  matchedAt: Date;
  attempts: number;     // How many tries to match this pair
  responseTime: number; // Time to complete this match
}

const validateMatch = (card1: Card, card2: Card, vocabulary: Map<string, VocabularyItem>): boolean => {
  // Must be different card types
  if (card1.type === card2.type) return false;
  
  // Must reference same vocabulary item
  if (card1.vocabularyId !== card2.vocabularyId) return false;
  
  // Additional validation: verify vocabulary item exists
  const vocabItem = vocabulary.get(card1.vocabularyId);
  return vocabItem !== undefined;
};
```

#### Card Selection Rules
1. **Two-Card Selection**: Player can select maximum 2 cards at a time
2. **Type Restriction**: Must select one picture card and one word card
3. **Selection Feedback**: Visual feedback on card selection
4. **Auto-Validation**: Automatic match checking after 2 cards selected
5. **Reset Logic**: Failed matches reset selection after feedback delay

### Game Board Configuration

#### Board Sizes by Device
```typescript
interface BoardConfiguration {
  mobile: {
    portrait: { rows: 4, cols: 2, cardSize: 'small' };
    landscape: { rows: 3, cols: 3, cardSize: 'small' };
  };
  tablet: {
    portrait: { rows: 4, cols: 3, cardSize: 'medium' };
    landscape: { rows: 3, cols: 4, cardSize: 'medium' };
  };
  desktop: {
    standard: { rows: 4, cols: 4, cardSize: 'large' };
  };
}

// Dynamic board sizing based on vocabulary count
const calculateBoardSize = (vocabularyCount: number, device: DeviceType): BoardSize => {
  const totalCards = vocabularyCount * 2; // Picture + word cards
  const configs = BoardConfiguration[device];
  
  // Find smallest configuration that fits all cards
  for (const config of Object.values(configs)) {
    if (config.rows * config.cols >= totalCards) {
      return config;
    }
  }
  
  // Fallback to largest available configuration
  return configs[Object.keys(configs).pop() as keyof typeof configs];
};
```

#### Card Shuffling Algorithm
```typescript
// Fisher-Yates shuffle with position tracking
const shuffleCards = (vocabulary: VocabularyItem[]): Card[] => {
  const cards: Card[] = [];
  
  // Create picture and word cards for each vocabulary item
  vocabulary.forEach((item, index) => {
    cards.push(
      {
        id: `pic-${item.id}`,
        type: 'picture',
        vocabularyId: item.id,
        position: index * 2,
        isSelected: false,
        isMatched: false,
        isVisible: true
      },
      {
        id: `word-${item.id}`,
        type: 'word', 
        vocabularyId: item.id,
        position: index * 2 + 1,
        isSelected: false,
        isMatched: false,
        isVisible: true
      }
    );
  });
  
  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  
  // Reassign positions after shuffle
  return cards.map((card, index) => ({ ...card, position: index }));
};
```

---

## Scoring System

### Point Calculation
```typescript
interface ScoringConfig {
  basePoints: 100;          // Points for basic match
  speedBonus: {
    under5s: 50;           // Fast match bonus
    under10s: 25;          // Moderate speed bonus
    over10s: 0;            // No speed bonus
  };
  accuracyBonus: {
    firstTry: 100;         // Perfect match bonus
    secondTry: 50;         // Good attempt bonus
    thirdTry: 0;           // No accuracy bonus
  };
  streakMultiplier: {
    streak3: 1.2;          // 20% bonus for 3+ streak
    streak5: 1.5;          // 50% bonus for 5+ streak
    streak10: 2.0;         // 100% bonus for 10+ streak
  };
  difficultyMultiplier: {
    level1: 1.0;           // Beginner
    level2: 1.2;           // Elementary
    level3: 1.5;           // Intermediate
    level4: 1.8;           // Upper Intermediate
    level5: 2.0;           // Advanced
  };
}

const calculateScore = (
  match: MatchPair, 
  currentStreak: number, 
  difficulty: number,
  config: ScoringConfig
): number => {
  let score = config.basePoints;
  
  // Speed bonus
  if (match.responseTime < 5000) {
    score += config.speedBonus.under5s;
  } else if (match.responseTime < 10000) {
    score += config.speedBonus.under10s;
  }
  
  // Accuracy bonus
  if (match.attempts === 1) {
    score += config.accuracyBonus.firstTry;
  } else if (match.attempts === 2) {
    score += config.accuracyBonus.secondTry;
  }
  
  // Streak multiplier
  let multiplier = 1.0;
  if (currentStreak >= 10) {
    multiplier = config.streakMultiplier.streak10;
  } else if (currentStreak >= 5) {
    multiplier = config.streakMultiplier.streak5;
  } else if (currentStreak >= 3) {
    multiplier = config.streakMultiplier.streak3;
  }
  
  // Difficulty multiplier
  const difficultyKey = `level${difficulty}` as keyof typeof config.difficultyMultiplier;
  multiplier *= config.difficultyMultiplier[difficultyKey];
  
  return Math.round(score * multiplier);
};
```

### Progress Tracking
```typescript
interface GameProgress {
  // Session progress
  currentScore: number;
  currentStreak: number;
  longestStreak: number;
  totalMatches: number;
  correctMatches: number;
  incorrectAttempts: number;
  
  // Time tracking
  sessionStartTime: Date;
  totalPlayTime: number;     // milliseconds
  averageMatchTime: number;  // milliseconds
  fastestMatch: number;      // milliseconds
  
  // Learning metrics
  wordsLearned: string[];    // New vocabulary learned this session
  wordsReviewed: string[];   // Previously learned vocabulary reviewed
  difficultyProgression: number; // Current difficulty level
  
  // Achievement tracking
  perfectMatches: number;    // First-try matches
  speedMatches: number;      // Under 5-second matches
  comboMatches: number;      // Streak achievements
}

const updateProgress = (
  progress: GameProgress, 
  match: MatchPair, 
  isCorrect: boolean
): GameProgress => {
  const now = Date.now();
  const sessionTime = now - progress.sessionStartTime.getTime();
  
  return {
    ...progress,
    currentScore: progress.currentScore + (isCorrect ? calculateScore(match, progress.currentStreak, 1, scoringConfig) : 0),
    currentStreak: isCorrect ? progress.currentStreak + 1 : 0,
    longestStreak: Math.max(progress.longestStreak, progress.currentStreak + (isCorrect ? 1 : 0)),
    totalMatches: progress.totalMatches + 1,
    correctMatches: progress.correctMatches + (isCorrect ? 1 : 0),
    incorrectAttempts: progress.incorrectAttempts + (!isCorrect ? 1 : 0),
    totalPlayTime: sessionTime,
    averageMatchTime: sessionTime / progress.totalMatches,
    fastestMatch: Math.min(progress.fastestMatch, match.responseTime),
    
    // Learning tracking
    wordsLearned: isCorrect && !progress.wordsReviewed.includes(match.vocabularyItem.id)
      ? [...progress.wordsLearned, match.vocabularyItem.id]
      : progress.wordsLearned,
    
    // Achievement tracking
    perfectMatches: progress.perfectMatches + (isCorrect && match.attempts === 1 ? 1 : 0),
    speedMatches: progress.speedMatches + (isCorrect && match.responseTime < 5000 ? 1 : 0),
    comboMatches: progress.comboMatches + (progress.currentStreak > 0 && progress.currentStreak % 5 === 0 ? 1 : 0)
  };
};
```

---

## Difficulty Progression

### Adaptive Difficulty System
```typescript
interface DifficultyLevel {
  level: 1 | 2 | 3 | 4 | 5;
  name: 'Beginner' | 'Elementary' | 'Intermediate' | 'Upper Intermediate' | 'Advanced';
  wordCount: number;        // Number of words per game
  timeLimit?: number;       // Optional time limit in seconds
  hintsAvailable: number;   // Number of hints allowed
  shuffleComplexity: 'low' | 'medium' | 'high'; // How mixed up cards are
  vocabularyComplexity: {
    minLength: number;      // Minimum word length
    maxLength: number;      // Maximum word length
    allowCompounds: boolean; // Allow compound words
    culturalDepth: 'basic' | 'intermediate' | 'advanced'; // Cultural context complexity
  };
}

const difficultyLevels: DifficultyLevel[] = [
  {
    level: 1,
    name: 'Beginner',
    wordCount: 6,
    hintsAvailable: 3,
    shuffleComplexity: 'low',
    vocabularyComplexity: {
      minLength: 3,
      maxLength: 6,
      allowCompounds: false,
      culturalDepth: 'basic'
    }
  },
  {
    level: 2, 
    name: 'Elementary',
    wordCount: 8,
    hintsAvailable: 2,
    shuffleComplexity: 'medium',
    vocabularyComplexity: {
      minLength: 4,
      maxLength: 8,
      allowCompounds: false,
      culturalDepth: 'basic'
    }
  },
  {
    level: 3,
    name: 'Intermediate', 
    wordCount: 10,
    timeLimit: 300, // 5 minutes
    hintsAvailable: 2,
    shuffleComplexity: 'high',
    vocabularyComplexity: {
      minLength: 5,
      maxLength: 12,
      allowCompounds: true,
      culturalDepth: 'intermediate'
    }
  },
  {
    level: 4,
    name: 'Upper Intermediate',
    wordCount: 12,
    timeLimit: 240, // 4 minutes
    hintsAvailable: 1,
    shuffleComplexity: 'high',
    vocabularyComplexity: {
      minLength: 6,
      maxLength: 15,
      allowCompounds: true,
      culturalDepth: 'advanced'
    }
  },
  {
    level: 5,
    name: 'Advanced',
    wordCount: 15,
    timeLimit: 180, // 3 minutes
    hintsAvailable: 1,
    shuffleComplexity: 'high',
    vocabularyComplexity: {
      minLength: 8,
      maxLength: 20,
      allowCompounds: true,
      culturalDepth: 'advanced'
    }
  }
];
```

### Automatic Difficulty Adjustment
```typescript
const calculateNewDifficulty = (
  currentDifficulty: number, 
  recentPerformance: GameProgress[]
): number => {
  const recentSessions = recentPerformance.slice(-5); // Last 5 sessions
  const avgAccuracy = recentSessions.reduce((sum, session) => 
    sum + (session.correctMatches / session.totalMatches), 0
  ) / recentSessions.length;
  
  const avgSpeed = recentSessions.reduce((sum, session) => 
    sum + session.averageMatchTime, 0
  ) / recentSessions.length;
  
  // Advancement criteria
  if (avgAccuracy > 0.85 && avgSpeed < 8000 && currentDifficulty < 5) {
    return currentDifficulty + 1; // Level up
  }
  
  // Regression criteria (optional - help struggling users)
  if (avgAccuracy < 0.60 && avgSpeed > 15000 && currentDifficulty > 1) {
    return currentDifficulty - 1; // Level down
  }
  
  return currentDifficulty; // Stay at current level
};
```

---

## Hint System

### Hint Types and Implementation
```typescript
interface HintSystem {
  visualHint: {
    type: 'glow' | 'pulse' | 'outline';
    targetCard: 'picture' | 'word' | 'both';
    duration: number; // milliseconds
    intensity: 'subtle' | 'moderate' | 'obvious';
  };
  
  culturalHint: {
    message: string;     // Cultural context clue
    displayTime: number; // How long to show hint
    position: 'overlay' | 'sidebar' | 'bottom';
  };
  
  eliminationHint: {
    cardsToHighlight: string[]; // Highlight correct options
    cardsToGrayOut: string[];   // Gray out incorrect options
  };
}

const generateHint = (
  currentMatch: { pictureCard?: Card; wordCard?: Card },
  vocabulary: VocabularyItem,
  hintLevel: 'gentle' | 'moderate' | 'obvious'
): HintSystem => {
  switch (hintLevel) {
    case 'gentle':
      return {
        visualHint: {
          type: 'glow',
          targetCard: currentMatch.pictureCard ? 'word' : 'picture',
          duration: 2000,
          intensity: 'subtle'
        },
        culturalHint: {
          message: `This word is used in ${vocabulary.culturalContext || 'everyday Irish conversation'}.`,
          displayTime: 3000,
          position: 'bottom'
        },
        eliminationHint: { cardsToHighlight: [], cardsToGrayOut: [] }
      };
      
    case 'moderate':
      return {
        visualHint: {
          type: 'pulse',
          targetCard: 'both',
          duration: 3000,
          intensity: 'moderate'
        },
        culturalHint: {
          message: `"${vocabulary.irishWord}" means "${vocabulary.englishTranslation}" in English.`,
          displayTime: 4000,
          position: 'overlay'
        },
        eliminationHint: { cardsToHighlight: [vocabulary.id], cardsToGrayOut: [] }
      };
      
    case 'obvious':
      // Find incorrect cards to gray out
      const incorrectCards = getIncorrectOptions(currentMatch, vocabulary);
      return {
        visualHint: {
          type: 'outline',
          targetCard: 'both',
          duration: 5000,
          intensity: 'obvious'
        },
        culturalHint: {
          message: `Match the picture with "${vocabulary.irishWord}" (${vocabulary.pronunciation})`,
          displayTime: 6000,
          position: 'overlay'
        },
        eliminationHint: { 
          cardsToHighlight: [vocabulary.id], 
          cardsToGrayOut: incorrectCards 
        }
      };
  }
};
```

### Hint Usage Tracking
```typescript
interface HintUsage {
  sessionHints: number;
  totalHints: number;
  hintEffectiveness: number; // 0-1 score of how often hints led to correct matches
  preferredHintType: 'visual' | 'cultural' | 'elimination';
  hintsPerCategory: Map<string, number>;
}

const trackHintUsage = (
  usage: HintUsage, 
  hintType: keyof HintSystem, 
  wasSuccessful: boolean
): HintUsage => {
  const effectiveness = (usage.hintEffectiveness * usage.totalHints + (wasSuccessful ? 1 : 0)) 
                       / (usage.totalHints + 1);
  
  return {
    ...usage,
    sessionHints: usage.sessionHints + 1,
    totalHints: usage.totalHints + 1,
    hintEffectiveness: effectiveness
  };
};
```

---

## Game State Management

### Game State Machine
```typescript
type GameState = 
  | 'initializing'     // Loading vocabulary and assets
  | 'ready'           // Ready to start, showing category selection
  | 'starting'        // Shuffling cards, preparing board
  | 'playing'         // Active gameplay
  | 'paused'          // Game paused by user
  | 'checking'        // Validating a match attempt
  | 'celebrating'     // Showing match success animation
  | 'correcting'      // Showing match failure feedback
  | 'completed'       // All matches found successfully
  | 'failed'          // Time limit exceeded or maximum errors reached
  | 'error';          // Technical error occurred

interface GameStateTransition {
  from: GameState;
  to: GameState;
  trigger: string;
  condition?: (context: GameContext) => boolean;
  action?: (context: GameContext) => GameContext;
}

const gameStateTransitions: GameStateTransition[] = [
  {
    from: 'ready',
    to: 'starting', 
    trigger: 'START_GAME',
    action: (context) => ({
      ...context,
      startTime: new Date(),
      shuffledCards: shuffleCards(context.vocabulary)
    })
  },
  {
    from: 'playing',
    to: 'checking',
    trigger: 'VALIDATE_MATCH',
    condition: (context) => context.selectedCards.length === 2
  },
  {
    from: 'checking',
    to: 'celebrating',
    trigger: 'MATCH_SUCCESS',
    action: (context) => updateScoreAndProgress(context, true)
  },
  {
    from: 'checking', 
    to: 'correcting',
    trigger: 'MATCH_FAILURE',
    action: (context) => updateScoreAndProgress(context, false)
  },
  {
    from: 'celebrating',
    to: 'completed',
    trigger: 'CHECK_COMPLETION',
    condition: (context) => allPairsMatched(context.cards)
  },
  {
    from: 'celebrating',
    to: 'playing',
    trigger: 'CONTINUE_GAME',
    condition: (context) => !allPairsMatched(context.cards)
  }
];
```

### Persistence Strategy
```typescript
interface GameSave {
  version: string;
  playerId: string;
  lastPlayed: Date;
  
  // Progress data
  categoryProgress: Map<string, CategoryProgress>;
  overallStats: PlayerStatistics;
  currentDifficulty: number;
  
  // Settings
  preferences: PlayerPreferences;
  
  // Current session (if resumable)
  currentSession?: {
    category: string;
    gameState: GameState;
    cards: Card[];
    progress: GameProgress;
    timeRemaining?: number;
  };
}

const saveGameProgress = async (gameData: GameSave): Promise<void> => {
  try {
    // Local storage for immediate persistence
    localStorage.setItem('irish-game-save', JSON.stringify(gameData));
    
    // IndexedDB for larger data (vocabulary progress)
    const db = await openGameDatabase();
    await db.put('progress', gameData);
    
    // Cloud sync (future feature)
    // await syncToCloud(gameData);
    
  } catch (error) {
    console.error('Failed to save game progress:', error);
    // Graceful fallback - continue playing without save
  }
};

const loadGameProgress = async (): Promise<GameSave | null> => {
  try {
    // Try IndexedDB first
    const db = await openGameDatabase();
    const saved = await db.get('progress');
    if (saved) return saved;
    
    // Fallback to localStorage
    const localSave = localStorage.getItem('irish-game-save');
    return localSave ? JSON.parse(localSave) : null;
    
  } catch (error) {
    console.error('Failed to load game progress:', error);
    return null;
  }
};
```

---

## Performance Optimizations

### Game Loop Optimization
```typescript
// Use requestAnimationFrame for smooth animations
class GameAnimationManager {
  private animationId?: number;
  private callbacks: Set<(timestamp: number) => void> = new Set();
  
  start() {
    const animate = (timestamp: number) => {
      this.callbacks.forEach(callback => callback(timestamp));
      this.animationId = requestAnimationFrame(animate);
    };
    this.animationId = requestAnimationFrame(animate);
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }
  }
  
  addCallback(callback: (timestamp: number) => void) {
    this.callbacks.add(callback);
  }
  
  removeCallback(callback: (timestamp: number) => void) {
    this.callbacks.delete(callback);
  }
}

// Debounced card selection to prevent rapid clicks
const useDebouncedCardSelection = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  
  const selectCard = useCallback(
    debounce((cardId: string) => {
      setIsSelecting(false);
      // Actual selection logic here
    }, 300),
    []
  );
  
  const handleCardClick = useCallback((cardId: string) => {
    if (isSelecting) return; // Prevent rapid selection
    setIsSelecting(true);
    selectCard(cardId);
  }, [isSelecting, selectCard]);
  
  return { handleCardClick, isSelecting };
};
```

### Memory Management
```typescript
// Cleanup unused vocabulary data
const useVocabularyCache = () => {
  const cache = useRef<Map<string, VocabularyItem[]>>(new Map());
  const maxCacheSize = 3; // Keep 3 categories in memory
  
  const getVocabulary = useCallback(async (category: string): Promise<VocabularyItem[]> => {
    if (cache.current.has(category)) {
      return cache.current.get(category)!;
    }
    
    const vocabulary = await loadVocabularyData(category);
    
    // Manage cache size
    if (cache.current.size >= maxCacheSize) {
      const firstKey = cache.current.keys().next().value;
      cache.current.delete(firstKey);
    }
    
    cache.current.set(category, vocabulary);
    return vocabulary;
  }, []);
  
  return { getVocabulary };
};
```

---

This game mechanics design provides a solid foundation for engaging, educational Irish language gameplay while maintaining performance and scalability for future enhancements.