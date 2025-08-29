# UI Mockups and Component Designs

**Phase**: 2 - Design & Architecture  
**Agent**: UI/UX Designer  
**Date**: 2024-08-29  
**Status**: In Progress

---

## Design System Foundation

### Color Palette
```css
:root {
  /* Primary Irish Brand Colors */
  --irish-green-primary: #009639;
  --irish-orange-primary: #FF7900;
  --irish-white: #FFFFFF;
  
  /* Extended Irish Palette */
  --emerald-light: #50C878;
  --emerald-dark: #006A35;
  --sage-green: #9CAF88;
  --warm-gold: #FFD700;
  --celtic-blue: #246BCE;
  
  /* Functional Colors */
  --success-green: #28A745;
  --warning-amber: #FFC107;
  --error-red: #DC3545;
  --info-blue: #17A2B8;
  
  /* Neutral Palette */
  --stone-gray-100: #F8F9FA;
  --stone-gray-200: #E9ECEF;
  --stone-gray-300: #DEE2E6;
  --stone-gray-400: #CED4DA;
  --stone-gray-500: #ADB5BD;
  --stone-gray-600: #6C757D;
  --stone-gray-700: #495057;
  --stone-gray-800: #343A40;
  --stone-gray-900: #212529;
  
  --cream-white: #FFFDD0;
  --charcoal-dark: #36454F;
}
```

### Typography System
```css
:root {
  /* Font Families */
  --font-primary: 'Noto Sans', 'Segoe UI', system-ui, sans-serif;
  --font-display: 'Cinzel', 'Georgia', serif;
  --font-irish: 'Noto Sans', 'Arial Unicode MS', sans-serif;
  
  /* Font Sizes - Mobile First */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  
  /* Irish Text Scaling */
  --irish-text-scale: 1.125; /* 12.5% larger for Irish text */
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### Spacing System
```css
:root {
  /* Spacing Scale */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  
  /* Component Spacing */
  --card-padding: var(--space-4);
  --card-gap: var(--space-4);
  --section-padding: var(--space-6);
  --container-padding: var(--space-4);
}
```

---

## Screen Designs

### 1. Game Loading Screen
```
┌─────────────────────────────────────┐
│               🍀                    │
│      Cluiche Gaeilge               │
│    Irish Matching Game             │
│                                     │
│        ⚪⚪⚪ Loading...             │
│                                     │
│    "Fáilte!" - Welcome!             │
└─────────────────────────────────────┘
```

**Design Specifications**:
- **Background**: Soft gradient from `--cream-white` to `--stone-gray-100`
- **Logo**: Celtic knot pattern with shamrock (authentic, not stereotypical)
- **Loading Animation**: Three dots in Irish flag colors
- **Typography**: Display font for title, welcoming Irish greeting

### 2. Main Menu Screen

#### Mobile Layout (320-479px)
```
┌───────────────────────────────────┐
│  🍀 Cluiche Gaeilge              │
│                                   │
│  ┌─────────────────────────────┐  │
│  │       🐕 ANIMALS            │  │
│  │     madra • cat • bó        │  │
│  │    ████████░░ 80%           │  │
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │       🎨 COLORS             │  │
│  │   dearg • gorm • bán        │  │
│  │    ██████░░░░ 60%           │  │
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │       🍞 FOOD               │  │
│  │     arán • bainne           │  │
│  │    ████░░░░░░ 40%           │  │
│  └─────────────────────────────┘  │
│                                   │
│  [⚙️ Settings]    [❓ Help]       │
└───────────────────────────────────┘
```

**Component Breakdown**:
- **Header**: Game title with Irish subtitle
- **Category Cards**: Large, touch-friendly selection cards
- **Progress Indicators**: Visual progress bars for each category
- **Footer Navigation**: Settings and help buttons

#### Desktop Layout (1024px+)
```
┌─────────────────────────────────────────────────────────────┐
│  🍀 Cluiche Gaeilge - Irish Matching Game                   │
│                                              [⚙️] [❓] [👤] │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  🐕 ANIMALS │  │  🎨 COLORS  │  │  🍞 FOOD    │        │
│  │             │  │             │  │             │        │
│  │ madra • cat │  │ dearg • gorm │  │ arán • bainne │      │
│  │    80%      │  │    60%      │  │    40%      │        │
│  │ ████████░░  │  │ ██████░░░░  │  │ ████░░░░░░  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐                         │
│  │ 👨‍👩‍👧‍👦 FAMILY  │  │  🔢 NUMBERS │                         │
│  │             │  │             │                         │
│  │máthair•athair│  │ haon • dó   │                         │
│  │    20%      │  │    10%      │                         │
│  │ ██░░░░░░░░  │  │ █░░░░░░░░░  │                         │
│  └─────────────┘  └─────────────┘                         │
│                                                             │
│               Recent Progress: +15 words today              │
└─────────────────────────────────────────────────────────────┘
```

### 3. Game Board Screen

#### Mobile Game Layout
```
┌───────────────────────────────────┐
│ 🐕 Animals    Score: 150  ⏱️ 2:30 │
│                                   │
│  Picture Cards:                   │
│  ┌─────┐  ┌─────┐                │
│  │ 🐕  │  │ 🐱  │                │
│  │ DOG │  │ CAT │                │
│  └─────┘  └─────┘                │
│                                   │
│  ┌─────┐  ┌─────┐                │
│  │ 🐄  │  │ 🐎  │                │
│  │ COW │  │HORSE│                │
│  └─────┘  └─────┘                │
│                                   │
│  Irish Word Cards:                │
│  ┌─────┐  ┌─────┐                │
│  │madra│  │ cat │                │
│  │     │  │     │ ← Selected     │
│  └─────┘  └─────┘                │
│                                   │
│  ┌─────┐  ┌─────┐                │
│  │ bó  │  │capall│               │
│  │     │  │     │                │
│  └─────┘  └─────┘                │
│                                   │
│  [💡 Hint]  [⏸️ Pause]           │
└───────────────────────────────────┘
```

**Game Board Features**:
- **Header**: Category, score, optional timer
- **Picture Cards**: Top section with English labels
- **Word Cards**: Bottom section with Irish words
- **Selected State**: Visual highlighting for selected cards
- **Game Controls**: Hint and pause functionality

### 4. Success Celebration Screen
```
┌───────────────────────────────────┐
│              ⭐ MAITH THÚ! ⭐      │
│             (Well done!)          │
│                                   │
│           🎉 Level Complete! 🎉   │
│                                   │
│         Score: 240 points         │
│         Time: 3:45                │
│         Accuracy: 85%             │
│                                   │
│     🏆 New words learned: 8       │
│                                   │
│  Cultural Context:                │
│  "madra" comes from Old Irish     │
│  and is the standard word for     │
│  dog in modern Irish.             │
│                                   │
│  [🔄 Play Again] [➡️ Next Level] │
│                                   │
│  [🏠 Main Menu]                   │
└───────────────────────────────────┘
```

**Success Screen Elements**:
- **Irish Celebration**: "Maith thú!" (Well done!)
- **Performance Stats**: Score, time, accuracy metrics
- **Learning Progress**: Words learned counter
- **Cultural Context**: Brief educational note
- **Navigation Options**: Replay, advance, or return to menu

---

## Component Specifications

### GameCard Component
```typescript
interface GameCardProps {
  id: string;
  type: 'picture' | 'word';
  content: string | ImageData;
  irishWord?: string;
  englishTranslation?: string;
  isSelected: boolean;
  isMatched: boolean;
  isDisabled?: boolean;
  culturalContext?: string;
  onSelect: (id: string) => void;
  size: 'small' | 'medium' | 'large';
  animationDelay?: number;
}
```

**Visual States**:
```css
.game-card {
  /* Base Card */
  border: 2px solid var(--stone-gray-300);
  border-radius: 12px;
  background: var(--irish-white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  
  /* Touch Optimized */
  min-height: 44px;
  min-width: 44px;
}

.game-card--selected {
  border-color: var(--irish-green-primary);
  box-shadow: 0 4px 12px rgba(0, 150, 57, 0.2);
  transform: translateY(-2px) scale(1.02);
}

.game-card--matched {
  background: var(--success-green);
  color: var(--irish-white);
  transform: scale(0.95);
  opacity: 0.8;
}

.game-card--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### CategoryCard Component
```typescript
interface CategoryCardProps {
  id: string;
  nameIrish: string;
  nameEnglish: string;
  icon: string;
  progress: number; // 0-100
  totalWords: number;
  learnedWords: number;
  isLocked: boolean;
  difficulty: 1 | 2 | 3 | 4 | 5;
  onSelect: (categoryId: string) => void;
}
```

**Progress Visualization**:
```css
.category-progress {
  width: 100%;
  height: 8px;
  background: var(--stone-gray-200);
  border-radius: 4px;
  overflow: hidden;
}

.category-progress__fill {
  height: 100%;
  background: linear-gradient(90deg, 
    var(--irish-green-primary), 
    var(--emerald-light));
  border-radius: 4px;
  transition: width 0.3s ease;
}
```

### ScorePanel Component
```typescript
interface ScorePanelProps {
  currentScore: number;
  streak: number;
  accuracy: number;
  timeElapsed?: number;
  hintsUsed: number;
  maxHints: number;
  showTimer: boolean;
}
```

---

## Responsive Breakpoints

### Mobile Portrait (320-479px)
- **Grid**: 2×4 card layout
- **Card Size**: 140×140px
- **Typography**: Base sizes
- **Spacing**: Minimal padding for screen efficiency

### Mobile Landscape (480-767px)
- **Grid**: 3×3 or 4×2 card layout
- **Card Size**: 120×120px
- **Typography**: Base sizes
- **Navigation**: Horizontal layout

### Tablet Portrait (768-1023px)
- **Grid**: 3×4 card layout
- **Card Size**: 160×160px
- **Typography**: Scaled up 10%
- **Sidebar**: Category navigation sidebar option

### Desktop (1024px+)
- **Grid**: 4×4 card layout
- **Card Size**: 180×180px
- **Typography**: Full scale
- **Layout**: Centered with max-width constraints

---

## Animation Specifications

### Card Interactions
```css
@keyframes card-flip {
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(90deg); }
  100% { transform: rotateY(0deg); }
}

@keyframes card-match {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(0.95); opacity: 0.8; }
}

@keyframes card-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
```

### Success Animations
```css
@keyframes celebration {
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
  100% { transform: scale(1) rotate(360deg); opacity: 1; }
}

@keyframes score-popup {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
}
```

---

## Accessibility Specifications

### Focus Management
```css
.game-card:focus {
  outline: 3px solid var(--celtic-blue);
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--charcoal-dark);
  color: var(--irish-white);
  padding: 8px;
  text-decoration: none;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}
```

### Screen Reader Support
```html
<!-- Example Card Markup -->
<button 
  class="game-card"
  aria-label="Picture card showing a dog, Irish word madra"
  aria-describedby="card-hint-123"
  aria-pressed="false"
  role="button"
>
  <img src="dog.webp" alt="Friendly dog sitting in grass" />
  <div id="card-hint-123" class="sr-only">
    This represents the Irish word madra, meaning dog in English
  </div>
</button>
```

### High Contrast Mode Support
```css
@media (prefers-contrast: high) {
  .game-card {
    border-width: 3px;
    border-color: var(--charcoal-dark);
  }
  
  .game-card--selected {
    background: var(--irish-white);
    border-color: var(--charcoal-dark);
    box-shadow: inset 0 0 0 3px var(--irish-green-primary);
  }
}
```

---

This comprehensive UI design provides a solid foundation for the Irish language matching game, balancing cultural authenticity with modern usability principles and ensuring accessibility for all users.