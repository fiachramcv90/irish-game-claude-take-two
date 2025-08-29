# Technical Architecture - Final Specification

**Phase**: 2 - Design & Architecture  
**Agent**: React Developer  
**Date**: 2024-08-29  
**Status**: Final Architecture Decision

---

## Technology Stack Decision - FINALIZED

### Core Technologies

#### Frontend Framework
**Selected**: **React 18+ with TypeScript**
- Latest React features (Concurrent Features, Suspense, etc.)
- Full TypeScript integration for type safety
- Excellent Irish character support through Unicode
- Large ecosystem for educational applications

#### Build Tool
**Selected**: **Vite 5+**
```json
{
  "reasoning": {
    "buildSpeed": "5-10x faster than webpack-based solutions",
    "devExperience": "Hot module replacement < 50ms",
    "bundleSize": "Tree-shaking optimized for mobile",
    "irishSupport": "Excellent Unicode and font handling",
    "deploymentSize": "Smaller production bundles"
  }
}
```

#### State Management
**Selected**: **React Context API + useReducer**
```typescript
// Decision rationale
interface StateManagementDecision {
  complexity: 'Medium'; // Game state is complex but not enterprise-level
  performance: 'Sufficient'; // Context performance adequate for game scope
  bundleImpact: 'Minimal'; // No external dependencies
  teamFamiliarity: 'High'; // Built-in React patterns
  irishContentHandling: 'Excellent'; // Native Unicode support
}
```

#### Styling Solution
**Selected**: **CSS Modules + CSS Custom Properties**
```css
/* Rationale for CSS Modules */
.gameCard {
  /* Scoped styles prevent conflicts */
  /* Irish character support via font-family */
  font-family: var(--font-irish);
  /* Component-based organization */
}

/* Global CSS Variables for Irish theming */
:root {
  --irish-green: #009639;
  --font-irish: 'Noto Sans', 'Arial Unicode MS', sans-serif;
}
```

#### Testing Framework
**Selected**: **Vitest + React Testing Library + Playwright**
- **Vitest**: Native Vite integration, faster than Jest
- **React Testing Library**: Accessibility-focused testing
- **Playwright**: Cross-browser testing for Irish character rendering

---

## Project Structure - FINALIZED

```
src/
├── components/                 # React Components
│   ├── game/                  # Game-specific components
│   │   ├── GameBoard/
│   │   │   ├── GameBoard.tsx
│   │   │   ├── GameBoard.module.css
│   │   │   └── GameBoard.test.tsx
│   │   ├── GameCard/
│   │   │   ├── GameCard.tsx
│   │   │   ├── GameCard.module.css
│   │   │   └── GameCard.test.tsx
│   │   └── ScorePanel/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button/
│   │   ├── Modal/
│   │   └── ProgressBar/
│   └── layout/                # Layout components
│       ├── Header/
│       ├── Navigation/
│       └── Container/
├── hooks/                     # Custom React hooks
│   ├── useGameLogic.ts        # Core game mechanics
│   ├── useIrishContent.ts     # Irish vocabulary management
│   ├── useLocalStorage.ts     # Persistence
│   └── useAccessibility.ts    # A11y utilities
├── contexts/                  # React Context providers
│   ├── GameContext.tsx        # Game state management
│   ├── ContentContext.tsx     # Irish vocabulary context
│   ├── UserContext.tsx        # User progress & preferences
│   └── ThemeContext.tsx       # UI theming
├── services/                  # Business logic & API
│   ├── gameEngine.ts          # Core game logic
│   ├── contentManager.ts      # Irish content management
│   ├── progressTracker.ts     # User progress tracking
│   └── audioManager.ts        # Audio pronunciation (future)
├── data/                      # Static data & configuration
│   ├── vocabulary/            # Irish language content
│   │   ├── animals.json
│   │   ├── colors.json
│   │   ├── food.json
│   │   ├── family.json
│   │   └── numbers.json
│   ├── categories.json        # Category metadata
│   └── gameConfig.json        # Game configuration
├── utils/                     # Utility functions
│   ├── irishLanguage.ts       # Irish language utilities
│   ├── gameScoring.ts         # Scoring algorithms
│   ├── accessibility.ts       # A11y helper functions
│   └── performance.ts         # Performance utilities
├── types/                     # TypeScript type definitions
│   ├── game.types.ts          # Game-related types
│   ├── irish.types.ts         # Irish language types
│   └── ui.types.ts            # UI component types
├── assets/                    # Static assets
│   ├── images/               # Game images
│   ├── fonts/                # Irish character fonts
│   └── icons/                # UI icons
└── styles/                   # Global styles
    ├── globals.css           # Global CSS variables
    ├── irish-fonts.css       # Irish typography
    └── animations.css        # Shared animations
```

---

## Core Architecture Patterns

### State Management Architecture

#### Game Context Structure
```typescript
interface GameState {
  // Current game session
  currentCategory: string;
  currentLevel: number;
  selectedCards: string[];
  matchedPairs: MatchedPair[];
  score: number;
  gameStatus: 'idle' | 'loading' | 'playing' | 'paused' | 'completed' | 'error';
  
  // Game configuration
  difficulty: DifficultyLevel;
  hintsRemaining: number;
  timerEnabled: boolean;
  startTime: Date | null;
  
  // Performance tracking
  totalAttempts: number;
  correctAttempts: number;
  averageResponseTime: number;
}

interface GameActions {
  type: 'START_GAME' | 'SELECT_CARD' | 'MATCH_FOUND' | 'MATCH_FAILED' 
       | 'USE_HINT' | 'PAUSE_GAME' | 'RESUME_GAME' | 'COMPLETE_GAME' 
       | 'RESET_GAME';
  payload?: any;
}

const gameReducer = (state: GameState, action: GameActions): GameState => {
  switch (action.type) {
    case 'SELECT_CARD':
      return handleCardSelection(state, action.payload);
    case 'MATCH_FOUND':
      return handleMatchFound(state, action.payload);
    // ... other cases
  }
};
```

#### Content Context Structure
```typescript
interface ContentState {
  // Irish vocabulary data
  vocabulary: Map<string, VocabularyItem>;
  categories: Category[];
  currentWordSet: VocabularyItem[];
  
  // Asset management
  images: Map<string, ImageAsset>;
  loadingStates: Map<string, LoadingState>;
  
  // Content configuration
  difficultySettings: DifficultySettings;
  culturalContext: Map<string, CulturalNote>;
}

interface VocabularyItem {
  id: string;
  irishWord: string;
  englishTranslation: string;
  pronunciation: string; // IPA notation
  category: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  culturalNotes?: string;
  imageId: string;
  tags: string[];
  frequency: number;
  verified: boolean;
}
```

### Component Architecture Patterns

#### Composition Pattern for Game Components
```typescript
// Container Component (Smart)
const GameBoard: React.FC = () => {
  const { gameState, dispatch } = useGameContext();
  const { currentWordSet } = useContentContext();
  
  return (
    <div className={styles.gameBoard}>
      <GameHeader 
        score={gameState.score}
        category={gameState.currentCategory}
        hintsRemaining={gameState.hintsRemaining}
      />
      <CardGrid 
        cards={createCardPairs(currentWordSet)}
        onCardSelect={(id) => dispatch({type: 'SELECT_CARD', payload: id})}
        selectedCards={gameState.selectedCards}
        matchedCards={gameState.matchedPairs}
      />
      <GameControls 
        onHint={() => dispatch({type: 'USE_HINT'})}
        onPause={() => dispatch({type: 'PAUSE_GAME'})}
        disabled={gameState.gameStatus !== 'playing'}
      />
    </div>
  );
};

// Presentational Component (Dumb)
const GameCard: React.FC<GameCardProps> = ({ 
  type, 
  content, 
  isSelected, 
  isMatched, 
  onSelect 
}) => {
  const cardClasses = `
    ${styles.gameCard} 
    ${isSelected ? styles.selected : ''} 
    ${isMatched ? styles.matched : ''}
  `;
  
  return (
    <button
      className={cardClasses}
      onClick={() => onSelect(content.id)}
      aria-label={createAriaLabel(type, content)}
      aria-pressed={isSelected}
    >
      {type === 'picture' ? (
        <PictureCardContent image={content.image} alt={content.englishTranslation} />
      ) : (
        <WordCardContent irishWord={content.irishWord} />
      )}
    </button>
  );
};
```

#### Custom Hooks Pattern
```typescript
// Game Logic Hook
const useGameLogic = (category: string) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const { vocabulary } = useContentContext();
  
  const selectCard = useCallback((cardId: string) => {
    dispatch({ type: 'SELECT_CARD', payload: cardId });
  }, []);
  
  const checkForMatch = useCallback(() => {
    if (gameState.selectedCards.length === 2) {
      const isMatch = validateMatch(
        gameState.selectedCards[0], 
        gameState.selectedCards[1],
        vocabulary
      );
      
      dispatch({ 
        type: isMatch ? 'MATCH_FOUND' : 'MATCH_FAILED', 
        payload: gameState.selectedCards 
      });
    }
  }, [gameState.selectedCards, vocabulary]);
  
  useEffect(() => {
    checkForMatch();
  }, [gameState.selectedCards, checkForMatch]);
  
  return {
    gameState,
    actions: {
      selectCard,
      startGame: () => dispatch({ type: 'START_GAME' }),
      pauseGame: () => dispatch({ type: 'PAUSE_GAME' }),
      resetGame: () => dispatch({ type: 'RESET_GAME' })
    }
  };
};

// Irish Content Hook
const useIrishContent = (category: string, difficulty: number) => {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadVocabulary(category, difficulty)
      .then(setVocabulary)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [category, difficulty]);
  
  const getRandomWordSet = useCallback((count: number) => {
    return shuffleArray(vocabulary).slice(0, count);
  }, [vocabulary]);
  
  return { vocabulary, loading, error, getRandomWordSet };
};
```

---

## Performance Architecture

### Bundle Optimization Strategy
```typescript
// Code Splitting by Category
const AnimalsGame = lazy(() => import('./components/game/categories/AnimalsGame'));
const ColorsGame = lazy(() => import('./components/game/categories/ColorsGame'));
const FoodGame = lazy(() => import('./components/game/categories/FoodGame'));

// Route-based code splitting
const App = () => (
  <Router>
    <Suspense fallback={<GameLoader />}>
      <Routes>
        <Route path="/animals" element={<AnimalsGame />} />
        <Route path="/colors" element={<ColorsGame />} />
        <Route path="/food" element={<FoodGame />} />
      </Routes>
    </Suspense>
  </Router>
);

// Asset optimization
const lazyImage = (imagePath: string) => ({
  loading: 'lazy' as const,
  src: `${imagePath}.webp`,
  srcSet: `${imagePath}-300.webp 300w, ${imagePath}-600.webp 600w`,
  sizes: '(max-width: 768px) 150px, 200px'
});
```

### Caching Strategy
```typescript
// Service Worker for Irish vocabulary caching
const CACHE_NAME = 'irish-game-v1';
const VOCABULARY_CACHE = 'vocabulary-v1';
const IMAGES_CACHE = 'images-v1';

// Cache Irish vocabulary data aggressively
const cacheVocabulary = async (category: string) => {
  const cache = await caches.open(VOCABULARY_CACHE);
  const vocabularyUrl = `/api/vocabulary/${category}.json`;
  await cache.add(vocabularyUrl);
};

// Progressive image loading
const useProgressiveImage = (imageId: string) => {
  const [src, setSrc] = useState(placeholderImage);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setSrc(img.src);
      setLoading(false);
    };
    img.src = `/images/vocabulary/${imageId}.webp`;
  }, [imageId]);
  
  return { src, loading };
};
```

### Memory Management
```typescript
// Cleanup patterns for game components
const GameBoard = () => {
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const animationRefs = useRef<number[]>([]);
  
  useEffect(() => {
    return () => {
      // Cleanup timeouts
      timeoutRefs.current.forEach(clearTimeout);
      // Cleanup animations
      animationRefs.current.forEach(cancelAnimationFrame);
    };
  }, []);
  
  // ... component logic
};

// Image cleanup for large vocabulary sets
const useImageCleanup = () => {
  useEffect(() => {
    const cleanup = () => {
      // Revoke object URLs to prevent memory leaks
      document.querySelectorAll('img[src^="blob:"]').forEach(img => {
        URL.revokeObjectURL(img.src);
      });
    };
    
    window.addEventListener('beforeunload', cleanup);
    return () => window.removeEventListener('beforeunload', cleanup);
  }, []);
};
```

---

## Irish Language Technical Requirements

### Font Loading Strategy
```css
/* Irish font loading with fallbacks */
@font-face {
  font-family: 'Noto Sans Irish';
  src: url('/fonts/NotoSans-Irish.woff2') format('woff2');
  font-display: swap; /* Prevent invisible text during font load */
  unicode-range: U+0000-00FF, U+00C0-00FF; /* Latin + Irish characters */
}

.irish-text {
  font-family: 'Noto Sans Irish', 'Arial Unicode MS', system-ui, sans-serif;
  font-feature-settings: 'kern' 1; /* Better kerning for fada characters */
  -webkit-font-smoothing: antialiased;
}
```

### Irish Character Support
```typescript
// Irish character validation
const validateIrishText = (text: string): boolean => {
  const irishPattern = /^[a-zA-ZáéíóúÁÉÍÓÚ\s-']*$/;
  return irishPattern.test(text);
};

// Pronunciation guide utilities
const formatIrishPronunciation = (ipa: string): string => {
  return `[${ipa}]`; // IPA notation formatting
};

// Screen reader pronunciation hints
const createAriaLabel = (irishWord: string, englishTranslation: string, ipa?: string): string => {
  const pronunciation = ipa ? `, pronounced ${ipa}` : '';
  return `Irish word ${irishWord}${pronunciation}, meaning ${englishTranslation} in English`;
};
```

---

## Testing Architecture

### Test Structure
```typescript
// Component testing with Irish content
describe('GameCard Component', () => {
  const mockIrishWord: VocabularyItem = {
    id: 'irish-dog',
    irishWord: 'madra',
    englishTranslation: 'dog',
    pronunciation: '/ˈmad̪ˠɾˠə/',
    category: 'animals',
    difficultyLevel: 1,
    imageId: 'dog-001',
    tags: ['pets'],
    frequency: 95,
    verified: true
  };
  
  it('should display Irish characters correctly', () => {
    render(<GameCard type="word" content={mockIrishWord} />);
    expect(screen.getByText('madra')).toBeInTheDocument();
  });
  
  it('should have proper aria-label for screen readers', () => {
    render(<GameCard type="word" content={mockIrishWord} />);
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label', 
      'Irish word madra, pronounced /ˈmad̪ˠɾˠə/, meaning dog in English'
    );
  });
});

// Irish language content testing
describe('Irish Content Validation', () => {
  it('should validate Irish character input', () => {
    expect(validateIrishText('madra')).toBe(true);
    expect(validateIrishText('fáilte')).toBe(true); // with fada
    expect(validateIrishText('hello123')).toBe(false); // numbers not allowed
  });
});
```

### Accessibility Testing
```typescript
// Custom accessibility testing for Irish content
const testIrishAccessibility = async (component: ReactElement) => {
  const { container } = render(component);
  
  // Test 1: Irish text has proper lang attribute
  const irishElements = container.querySelectorAll('[lang="ga"]');
  expect(irishElements.length).toBeGreaterThan(0);
  
  // Test 2: Pronunciation information is available to screen readers
  const ariaLabels = container.querySelectorAll('[aria-label*="pronounced"]');
  expect(ariaLabels.length).toBeGreaterThan(0);
  
  // Test 3: Color contrast meets WCAG standards
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};
```

---

## Deployment Architecture

### Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    // PWA for offline Irish learning
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^.*\.(json)$/,
            handler: 'CacheFirst', // Cache Irish vocabulary aggressively
            options: {
              cacheName: 'irish-vocabulary-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    // Optimize for Irish character fonts
    assetsInlineLimit: 0, // Don't inline fonts
    rollupOptions: {
      output: {
        manualChunks: {
          'irish-vocabulary': ['./src/data/vocabulary/'],
          'game-engine': ['./src/services/gameEngine.ts'],
          'ui-components': ['./src/components/ui/']
        }
      }
    }
  }
});
```

### Performance Monitoring
```typescript
// Performance metrics specific to Irish language learning
const trackGamePerformance = () => {
  // Irish character rendering performance
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.name.includes('irish-text-render')) {
        console.log(`Irish text render time: ${entry.duration}ms`);
      }
    });
  });
  
  observer.observe({ entryTypes: ['measure'] });
};

// Memory usage tracking for vocabulary loading
const trackMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log(`Memory usage: ${memory.usedJSHeapSize / 1024 / 1024}MB`);
  }
};
```

---

This technical architecture provides a robust, scalable foundation for the Irish Language Matching Game while ensuring excellent performance, accessibility, and maintainability.