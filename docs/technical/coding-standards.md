# Coding Standards

This document establishes coding conventions, best practices, and quality standards for the Irish Language Matching Game project.

## General Principles

### Code Quality Principles
- **Readability**: Code should be self-documenting and easy to understand
- **Consistency**: Follow established patterns throughout the codebase
- **Maintainability**: Write code that can be easily modified and extended
- **Performance**: Consider performance implications of coding decisions
- **Accessibility**: Ensure all code supports assistive technologies

### Documentation Standards
- **Self-Documenting Code**: Use descriptive names and clear structure
- **JSDoc Comments**: Document all public interfaces and complex logic
- **README Files**: Maintain clear setup and usage instructions
- **Decision Documentation**: Record architectural and design decisions

---

## TypeScript Standards

### Type Definitions

#### Strict TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

#### Interface and Type Naming
```typescript
// Use PascalCase for interfaces and types
interface GameState {
  currentLevel: number;
  score: number;
}

type GameStatus = 'loading' | 'playing' | 'paused' | 'completed';

// Use descriptive names that indicate purpose
interface IrishVocabularyItem {
  id: string;
  irishWord: string;
  englishTranslation: string;
}

// Avoid generic names like 'Data' or 'Info'
// Bad: interface UserData
// Good: interface UserProgress
```

#### Generic Type Usage
```typescript
// Use meaningful constraint names
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T>;
  save(item: T): Promise<void>;
}

// Prefer specific types over any
// Bad: const processData = (data: any) => { ... }
// Good: const processVocabulary = (items: VocabularyItem[]) => { ... }
```

### Function and Variable Naming

#### Naming Conventions
```typescript
// Use camelCase for variables and functions
const currentGameState = getGameState();
const calculateScore = (matches: number) => matches * 10;

// Use descriptive boolean names with is/has/can prefixes
const isGameComplete = checkGameCompletion();
const hasRemainingHints = checkHintAvailability();
const canAdvanceLevel = checkLevelRequirements();

// Use verbs for functions, nouns for variables
const updateScore = (newScore: number) => { ... }; // Good: verb
const scoreUpdater = (newScore: number) => { ... }; // Less clear
```

#### Irish Language Specific Naming
```typescript
// Use clear prefixes for Irish language content
const irishWord = 'madra';
const englishTranslation = 'dog';
const gaeilgeText = 'Cad is ainm duit?'; // When specifically Irish

// Avoid abbreviations that might be unclear
// Bad: const ir_word = 'cat';
// Good: const irishWord = 'cat';
```

---

## React Component Standards

### Component Structure

#### Functional Components with Hooks
```typescript
// Use arrow functions for consistency
const GameCard: React.FC<GameCardProps> = ({ 
  irishWord, 
  englishTranslation, 
  imageUrl, 
  isSelected, 
  onSelect 
}) => {
  // Hooks at the top
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Event handlers
  const handleClick = useCallback(() => {
    if (!isAnimating) {
      onSelect(irishWord);
    }
  }, [irishWord, isAnimating, onSelect]);
  
  // Effects
  useEffect(() => {
    if (isSelected) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isSelected]);
  
  // Render
  return (
    <div 
      ref={cardRef}
      className={`game-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Irish word: ${irishWord}, English: ${englishTranslation}`}
    >
      <img src={imageUrl} alt={englishTranslation} />
      <span className="irish-text">{irishWord}</span>
    </div>
  );
};
```

#### Component Props Interface
```typescript
// Define props interfaces separately for reusability
interface GameCardProps {
  irishWord: string;
  englishTranslation: string;
  imageUrl: string;
  isSelected: boolean;
  isMatched?: boolean;
  disabled?: boolean;
  onSelect: (word: string) => void;
  className?: string;
}

// Use optional props thoughtfully
interface OptionalPropsExample {
  required: string;
  optional?: string; // Only if truly optional
  defaultValue: string; // Better: provide default in component
}
```

### Hook Standards

#### Custom Hooks
```typescript
// Use 'use' prefix and descriptive names
const useGameLogic = (vocabulary: VocabularyItem[]) => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  
  const selectCard = useCallback((cardId: string) => {
    setSelectedCards(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      }
      return prev.length < 2 ? [...prev, cardId] : [cardId];
    });
  }, []);
  
  return {
    gameState,
    selectedCards,
    selectCard,
    // Always return an object for extensibility
  };
};

// Use dependency arrays correctly
useEffect(() => {
  // Effect logic
}, [dependency1, dependency2]); // Include all dependencies

// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return processVocabularyData(vocabulary);
}, [vocabulary]);
```

### State Management Standards

#### Context Usage
```typescript
// Create typed context with default values
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  actions: {
    selectCard: (cardId: string) => void;
    resetGame: () => void;
  };
}

const GameContext = createContext<GameContextType | null>(null);

// Custom hook for context usage
const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
};
```

#### Reducer Patterns
```typescript
// Use discriminated unions for actions
type GameAction = 
  | { type: 'CARD_SELECTED'; payload: { cardId: string } }
  | { type: 'MATCH_FOUND'; payload: { pair: MatchedPair } }
  | { type: 'GAME_RESET'; payload?: undefined };

// Implement reducer with proper typing
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'CARD_SELECTED':
      return {
        ...state,
        selectedCards: updateSelectedCards(state.selectedCards, action.payload.cardId)
      };
    case 'MATCH_FOUND':
      return {
        ...state,
        matchedPairs: [...state.matchedPairs, action.payload.pair],
        score: state.score + calculateMatchScore(action.payload.pair)
      };
    case 'GAME_RESET':
      return initialGameState;
    default:
      // TypeScript ensures exhaustive checking
      const _exhaustiveCheck: never = action;
      return state;
  }
};
```

---

## CSS and Styling Standards

### CSS Architecture

#### BEM Methodology
```css
/* Block - Component */
.game-card {
  display: flex;
  flex-direction: column;
  border: 2px solid #ddd;
  border-radius: 8px;
}

/* Element - Child of component */
.game-card__image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.game-card__text {
  padding: 12px;
  text-align: center;
}

/* Modifier - Variation of component */
.game-card--selected {
  border-color: #007bff;
  background-color: #f0f8ff;
}

.game-card--disabled {
  opacity: 0.5;
  pointer-events: none;
}
```

#### CSS Custom Properties (Variables)
```css
:root {
  /* Irish-themed color palette */
  --color-irish-green: #009639;
  --color-irish-orange: #ff7900;
  --color-irish-gold: #ffd700;
  
  /* Typography */
  --font-family-irish: 'Noto Sans', 'Arial Unicode MS', sans-serif;
  --font-size-irish-large: 1.25rem;
  --font-size-irish-normal: 1rem;
  
  /* Spacing */
  --spacing-card-gap: 16px;
  --spacing-container: 24px;
  
  /* Breakpoints */
  --breakpoint-mobile: 480px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1024px;
}
```

#### Responsive Design Standards
```css
/* Mobile-first approach */
.game-board {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-card-gap);
  padding: var(--spacing-container);
}

/* Tablet */
@media (min-width: 768px) {
  .game-board {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .game-board {
    grid-template-columns: repeat(4, 1fr);
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Irish Language Typography

#### Font Selection and Loading
```css
/* Ensure proper Irish character support */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600&display=swap');

.irish-text {
  font-family: 'Noto Sans', 'Arial Unicode MS', sans-serif;
  font-feature-settings: 'kern' 1; /* Better kerning for accented characters */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Larger text for Irish words to improve readability */
.irish-word {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

.english-translation {
  font-size: 1rem;
  color: #666;
  font-style: italic;
}
```

---

## Testing Standards

### Unit Testing

#### Component Testing with React Testing Library
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameCard } from '../GameCard';

describe('GameCard Component', () => {
  const mockProps = {
    irishWord: 'madra',
    englishTranslation: 'dog',
    imageUrl: '/images/dog.jpg',
    isSelected: false,
    onSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render Irish word and translation', () => {
    render(<GameCard {...mockProps} />);
    
    expect(screen.getByText('madra')).toBeInTheDocument();
    expect(screen.getByAltText('dog')).toBeInTheDocument();
  });

  it('should call onSelect when clicked', async () => {
    const user = userEvent.setup();
    render(<GameCard {...mockProps} />);
    
    await user.click(screen.getByRole('button'));
    
    expect(mockProps.onSelect).toHaveBeenCalledWith('madra');
  });

  it('should be accessible to screen readers', () => {
    render(<GameCard {...mockProps} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label', 'Irish word: madra, English: dog');
  });
});
```

#### Hook Testing
```typescript
import { renderHook, act } from '@testing-library/react';
import { useGameLogic } from '../hooks/useGameLogic';
import { mockVocabulary } from '../__mocks__/vocabulary';

describe('useGameLogic Hook', () => {
  it('should initialize with empty selected cards', () => {
    const { result } = renderHook(() => useGameLogic(mockVocabulary));
    
    expect(result.current.selectedCards).toEqual([]);
    expect(result.current.gameState.score).toBe(0);
  });

  it('should handle card selection correctly', () => {
    const { result } = renderHook(() => useGameLogic(mockVocabulary));
    
    act(() => {
      result.current.selectCard('card-1');
    });
    
    expect(result.current.selectedCards).toEqual(['card-1']);
  });
});
```

### Integration Testing

#### Context and State Testing
```typescript
import { render, screen } from '@testing-library/react';
import { GameProvider } from '../contexts/GameContext';
import { GameBoard } from '../components/GameBoard';

const renderWithGameContext = (component: React.ReactElement) => {
  return render(
    <GameProvider>
      {component}
    </GameProvider>
  );
};

describe('Game Integration', () => {
  it('should handle complete game flow', async () => {
    renderWithGameContext(<GameBoard />);
    
    // Test game initialization
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
    
    // Test card interactions
    // ... integration test logic
  });
});
```

### Test Utilities and Mocks

#### Mock Data
```typescript
// __mocks__/vocabulary.ts
export const mockVocabularyItem: VocabularyItem = {
  id: 'irish-dog',
  irishWord: 'madra',
  englishTranslation: 'dog',
  category: 'animals',
  difficultyLevel: 1,
  imageId: 'dog-image-1',
  tags: ['pets', 'common']
};

export const mockVocabulary: VocabularyItem[] = [
  mockVocabularyItem,
  {
    id: 'irish-cat',
    irishWord: 'cat',
    englishTranslation: 'cat',
    category: 'animals',
    difficultyLevel: 1,
    imageId: 'cat-image-1',
    tags: ['pets', 'common']
  }
];
```

---

## Performance Standards

### Code Performance

#### Bundle Size Monitoring
```typescript
// Use dynamic imports for code splitting
const SettingsModal = lazy(() => import('./SettingsModal'));
const HelpModal = lazy(() => import('./HelpModal'));

// Implement in component
const GameContainer = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/settings" element={<SettingsModal />} />
        <Route path="/help" element={<HelpModal />} />
      </Routes>
    </Suspense>
  );
};
```

#### Memoization Best Practices
```typescript
// Memoize expensive calculations
const processedVocabulary = useMemo(() => {
  return vocabulary
    .filter(item => item.category === selectedCategory)
    .sort((a, b) => a.difficultyLevel - b.difficultyLevel);
}, [vocabulary, selectedCategory]);

// Memoize components with complex props
const MemoizedGameCard = memo(GameCard, (prevProps, nextProps) => {
  return (
    prevProps.irishWord === nextProps.irishWord &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isMatched === nextProps.isMatched
  );
});
```

### Asset Performance

#### Image Optimization
```typescript
// Lazy loading images
const LazyImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
      onError={() => setError(true)}
      className={`image ${isLoaded ? 'loaded' : 'loading'}`}
    />
  );
};
```

---

## Accessibility Standards

### WCAG Compliance

#### Semantic HTML
```typescript
const GameCard = ({ irishWord, englishTranslation, onSelect }: GameCardProps) => {
  return (
    <button
      className="game-card"
      onClick={() => onSelect(irishWord)}
      aria-label={`Match ${irishWord} which means ${englishTranslation} in English`}
      aria-pressed={isSelected}
    >
      <img 
        src={imageUrl} 
        alt={`Picture representing ${englishTranslation}`}
        role="img"
      />
      <span className="irish-text" lang="ga">
        {irishWord}
      </span>
      <span className="english-text" lang="en">
        {englishTranslation}
      </span>
    </button>
  );
};
```

#### Keyboard Navigation
```typescript
const useKeyboardNavigation = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          focusPreviousCard();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          focusNextCard();
          break;
        case ' ':
        case 'Enter':
          event.preventDefault();
          selectCurrentCard();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};
```

---

## Error Handling Standards

### Error Boundaries
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class GameErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game Error:', error, errorInfo);
    // Log to error reporting service in production
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Oops! Something went wrong with the game.</h2>
          <button onClick={() => window.location.reload()}>
            Restart Game
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Async Error Handling
```typescript
const useAsyncError = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const executeAsync = useCallback(async <T>(
    asyncOperation: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncOperation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { error, loading, executeAsync, clearError: () => setError(null) };
};
```

---

These coding standards ensure consistent, maintainable, and high-quality code throughout the Irish Language Matching Game project while supporting accessibility and performance requirements.