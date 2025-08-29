# Technical Architecture

This document outlines the technical architecture for the Irish Language Matching Game, including system design, technology stack, and implementation patterns.

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────┐
│                Frontend (React)              │
├─────────────────┬───────────────────────────┤
│   UI Components │     Game Logic            │
│   - GameBoard   │     - Matching Engine     │
│   - Cards       │     - Scoring System      │
│   - Navigation  │     - Progress Tracking   │
└─────────────────┼───────────────────────────┤
│            State Management (Context/Redux)   │
├─────────────────┼───────────────────────────┤
│               Content Layer                  │
│   - Irish Vocabulary Data                    │
│   - Image Assets                            │
│   - Game Configuration                       │
└─────────────────────────────────────────────┘
```

### Architecture Principles
- **Component-Based**: Reusable, composable React components
- **Separation of Concerns**: Clear boundaries between UI, logic, and data
- **Performance First**: Optimized for mobile devices and slow connections
- **Accessibility**: WCAG 2.1 AA compliance throughout
- **Scalability**: Designed to accommodate content and feature expansion

---

## Technology Stack

### Core Technologies
**Frontend Framework**: React 18+
- Component-based architecture
- Built-in accessibility features
- Large ecosystem and community support
- Strong TypeScript integration

**Build Tool**: To be determined in Phase 2
- Options: Vite (recommended), Create React App, or Next.js
- Criteria: Build speed, bundle optimization, development experience

**State Management**: To be determined in Phase 2  
- Options: Context API + useReducer, Redux Toolkit, or Zustand
- Criteria: Complexity needs, performance, team familiarity

**Styling Solution**: To be determined in Phase 2
- Options: CSS Modules, Styled Components, or Tailwind CSS
- Criteria: Irish text support, responsive design, bundle size

### Supporting Technologies
**Testing Framework**: 
- Jest + React Testing Library (unit/integration tests)
- Cypress or Playwright (end-to-end tests)

**TypeScript**: Full TypeScript implementation
- Type safety for Irish language content
- Better developer experience and error catching
- Self-documenting code interfaces

**Asset Management**:
- Image optimization (WebP format with fallbacks)  
- Lazy loading for performance
- CDN consideration for production

---

## Component Architecture

### Component Hierarchy

```
App
├── GameContainer
│   ├── GameBoard
│   │   ├── Card (Picture Card)
│   │   ├── Card (Word Card)  
│   │   └── MatchingArea
│   ├── ScorePanel
│   │   ├── CurrentScore
│   │   ├── ProgressIndicator
│   │   └── TimerDisplay (optional)
│   └── GameControls
│       ├── PauseButton
│       ├── HintButton  
│       └── SettingsButton
├── NavigationMenu
│   ├── CategorySelector
│   ├── DifficultySelector
│   └── ProgressOverview
├── SettingsModal
└── HelpModal
```

### Component Design Patterns

#### Smart vs Presentational Components
**Smart Components** (Container Components):
- `GameContainer`: Manages game state and logic
- `App`: Handles routing and global state
- `NavigationMenu`: Manages navigation state

**Presentational Components** (UI Components):
- `Card`: Displays individual cards with props
- `ScorePanel`: Shows scoring information
- `Button`: Reusable button component

#### Component Props Interface
```typescript
interface CardProps {
  id: string;
  type: 'picture' | 'word';
  content: string | ImageData;
  irishText?: string;
  englishTranslation?: string;
  isSelected: boolean;
  isMatched: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

interface GameState {
  currentLevel: number;
  selectedCards: string[];
  matchedPairs: string[];
  score: number;
  gameStatus: 'loading' | 'playing' | 'paused' | 'completed';
  currentCategory: string;
}
```

---

## State Management Architecture

### State Structure Design

```typescript
// Global Application State
interface AppState {
  game: GameState;
  content: ContentState;
  user: UserState;
  ui: UIState;
}

interface GameState {
  // Current game session
  currentLevel: number;
  selectedCards: string[];
  matchedPairs: MatchedPair[];
  score: number;
  gameStatus: GameStatus;
  currentCategory: string;
  startTime: Date;
  
  // Game configuration
  difficulty: DifficultyLevel;
  hintsRemaining: number;
  timerEnabled: boolean;
}

interface ContentState {
  // Irish language content
  vocabulary: VocabularyItem[];
  categories: Category[];
  currentWordSet: VocabularyItem[];
  
  // Asset management
  images: Record<string, ImageData>;
  loadingStates: Record<string, LoadingState>;
}

interface UserState {
  // Preferences and progress
  preferences: UserPreferences;
  progress: ProgressData;
  statistics: GameStatistics;
  
  // Persistence
  lastPlayed: Date;
  achievedLevels: number[];
}

interface UIState {
  // Modal and overlay states
  modalsOpen: Record<string, boolean>;
  loading: boolean;
  errors: ErrorState[];
  
  // Responsive design state
  screenSize: ScreenSize;
  orientation: Orientation;
}
```

### State Management Patterns

#### Actions and Reducers
```typescript
// Game Actions
type GameAction = 
  | { type: 'CARD_SELECTED'; payload: { cardId: string } }
  | { type: 'MATCH_FOUND'; payload: { pair: MatchedPair } }
  | { type: 'GAME_COMPLETED'; payload: { finalScore: number } }
  | { type: 'LEVEL_ADVANCED'; payload: { newLevel: number } };

// Game Reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'CARD_SELECTED':
      return handleCardSelection(state, action.payload.cardId);
    case 'MATCH_FOUND':
      return handleMatchFound(state, action.payload.pair);
    // ... other cases
  }
};
```

#### Context Providers
```typescript
// Game Context for game-specific state
const GameContext = createContext<GameContextType>();

// Content Context for Irish vocabulary and assets  
const ContentContext = createContext<ContentContextType>();

// User Context for preferences and progress
const UserContext = createContext<UserContextType>();
```

---

## Data Architecture

### Irish Language Content Structure

```typescript
interface VocabularyItem {
  id: string;
  irishWord: string;
  englishTranslation: string;
  pronunciation?: string; // IPA or audio file path
  category: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  culturalNotes?: string;
  imageId: string;
  tags: string[];
}

interface Category {
  id: string;
  nameIrish: string;
  nameEnglish: string;
  description: string;
  colorTheme: string;
  iconId: string;
  vocabularyCount: number;
}

interface ImageAsset {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  formats: {
    webp?: string;
    jpeg?: string;
    png?: string;
  };
}
```

### Content Organization

```
content/
├── vocabulary/
│   ├── animals.json
│   ├── colors.json  
│   ├── food.json
│   └── numbers.json
├── images/
│   ├── optimized/
│   │   ├── webp/
│   │   ├── jpeg/  
│   │   └── thumbnails/
│   └── original/
└── audio/ (future expansion)
    └── pronunciations/
```

### Data Loading Strategy

#### Progressive Loading
1. **Critical Path**: Load minimum viable content for first game
2. **Category Loading**: Load additional categories on demand  
3. **Asset Preloading**: Preload images for next level during gameplay
4. **Background Loading**: Load future content during idle periods

#### Caching Strategy
- **Service Worker**: Cache critical game assets
- **Local Storage**: Save user progress and preferences
- **Memory Caching**: Cache processed vocabulary data
- **Image Caching**: Browser cache with appropriate headers

---

## Performance Architecture

### Optimization Strategies

#### Bundle Optimization
- **Code Splitting**: Separate chunks for different game categories
- **Tree Shaking**: Remove unused code from final bundle
- **Dynamic Imports**: Load features on demand
- **Asset Optimization**: Compress images and optimize formats

#### Runtime Performance
- **Virtual Scrolling**: For large vocabulary lists (if needed)
- **Memoization**: React.memo for expensive component renders
- **Lazy Loading**: Images and non-critical components
- **Debouncing**: User input handling and API calls

#### Mobile Optimization
- **Touch Optimizations**: Eliminate 300ms click delay
- **Viewport Management**: Proper mobile viewport configuration
- **Memory Management**: Efficient card component lifecycle
- **Network Awareness**: Adapt to connection quality

### Performance Metrics

#### Target Performance Goals
- **First Contentful Paint**: < 1.5 seconds
- **Largest Contentful Paint**: < 2.5 seconds  
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100 milliseconds
- **Bundle Size**: < 200KB gzipped (initial load)

#### Monitoring Strategy
- **Core Web Vitals**: Regular performance auditing
- **Real User Monitoring**: Track actual user experience
- **Lighthouse CI**: Automated performance testing
- **Bundle Analysis**: Regular bundle size monitoring

---

## Security Architecture

### Data Security
- **Input Sanitization**: All user inputs sanitized
- **XSS Prevention**: Content Security Policy implemented
- **Local Storage Encryption**: Sensitive data encrypted before storage
- **Asset Integrity**: Subresource integrity for external assets

### Privacy Considerations
- **No External Tracking**: Game works completely offline-capable
- **Local Data Only**: All progress stored locally
- **GDPR Compliance**: No personal data collection
- **Accessibility Data**: Screen reader and assistive technology support

---

## Testing Architecture

### Testing Strategy

#### Unit Testing
- **Component Testing**: React Testing Library for UI components
- **Logic Testing**: Jest for game logic and utilities
- **Hook Testing**: Custom hooks with React Hooks Testing Library
- **Coverage Target**: 80%+ code coverage

#### Integration Testing  
- **State Management**: Test state transitions and side effects
- **Content Integration**: Verify Irish vocabulary loading and display
- **Responsive Design**: Test layout adaptations across breakpoints

#### End-to-End Testing
- **Game Flow**: Complete gameplay scenarios
- **Cross-Browser**: Testing on major browsers and devices
- **Accessibility**: Screen reader and keyboard navigation testing
- **Performance**: Load testing and stress testing

### Testing Tools

```typescript
// Example Test Structure
describe('GameBoard Component', () => {
  it('should display cards correctly', () => {
    render(<GameBoard vocabulary={mockVocabulary} />);
    expect(screen.getByText('madra')).toBeInTheDocument();
  });
  
  it('should handle card selection', async () => {
    const onCardSelect = jest.fn();
    render(<GameBoard onCardSelect={onCardSelect} />);
    
    await userEvent.click(screen.getByText('madra'));
    expect(onCardSelect).toHaveBeenCalledWith('card-1');
  });
});
```

---

## Deployment Architecture

### Build Process
- **TypeScript Compilation**: Full type checking in CI/CD
- **Asset Optimization**: Image compression and format conversion
- **Bundle Analysis**: Size monitoring and optimization
- **Quality Gates**: Linting, testing, and accessibility checks

### Hosting Strategy
- **Static Site Hosting**: Vercel, Netlify, or GitHub Pages
- **CDN Integration**: Global asset delivery
- **Progressive Enhancement**: Works with JavaScript disabled
- **Offline Capability**: Service worker for offline gameplay

### CI/CD Pipeline
```yaml
# Example GitHub Actions workflow
name: Build and Deploy
on: [push, pull_request]
jobs:
  test:
    - Lint TypeScript and CSS
    - Run unit and integration tests
    - Check accessibility compliance
    - Validate Irish language content
  build:
    - Optimize assets and bundle
    - Generate production build
    - Run Lighthouse audit
  deploy:
    - Deploy to staging environment
    - Run end-to-end tests
    - Deploy to production (on main branch)
```

---

This architecture provides a solid foundation for building a scalable, performant, and maintainable Irish language matching game while supporting the multi-agent development workflow.