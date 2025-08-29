/**
 * TypeScript type definitions for Irish Language Matching Game
 * Phase 3: Content & Asset Creation
 * Comprehensive type safety for Irish vocabulary and cultural content
 */

// Core Irish vocabulary item
export interface VocabularyItem {
  id: string;                    // Unique identifier (e.g., "madra-dog-001")
  irishWord: string;            // Irish language word
  englishTranslation: string;   // English translation
  pronunciation: string;        // IPA pronunciation notation
  difficultyLevel: 1 | 2 | 3 | 4 | 5;  // Learning difficulty
  frequency: number;            // Usage frequency (0-100)
  verified: boolean;            // Expert verification status
  culturalNotes?: string;       // Cultural context and significance
  tags: string[];               // Classification tags
  imageId: string;              // Associated image identifier
  addedDate: string;            // ISO date string when added
}

// Category information
export interface Category {
  id: string;                   // Category identifier
  nameIrish: string;           // Category name in Irish
  nameEnglish: string;         // Category name in English
  description: string;         // Category description
  icon: string;                // Emoji or icon identifier
  colorTheme: string;          // Primary color for UI theming
  difficultyLevel: 1 | 2 | 3 | 4 | 5;  // Overall category difficulty
  priority: 1 | 2 | 3;         // Implementation priority
  totalWords: number;          // Total vocabulary words in category
  completedWords: number;      // User's completed words
  progressPercent: number;     // User's progress percentage
  isLocked: boolean;           // Whether category is available
  estimatedPlayTime: string;   // Expected play duration
  unlockRequirement?: string;  // Requirements to unlock
  culturalContext: string;     // Cultural background information
  learningObjectives: string[]; // Educational goals
}

// Complete category data structure
export interface CategoryData {
  category: string;
  nameIrish: string;
  nameEnglish: string;
  description: string;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  priority: 1 | 2 | 3;
  totalWords: number;
  icon: string;
  colorTheme: string;
  culturalContext: string;
  learningObjectives: string[];
  vocabulary: VocabularyItem[];
}

// Image asset metadata
export interface ImageAsset {
  id: string;                  // Image identifier
  irishWord: string;          // Associated Irish word
  englishTranslation: string; // Associated English word
  category: string;           // Category association
  files: {
    webp: Record<string, number>;  // WebP file sizes by dimension
    jpeg: Record<string, number>;  // JPEG file sizes by dimension
    png: Record<string, number>;   // PNG file sizes by dimension
  };
  paths: {
    webp: Record<string, string>;  // WebP file paths by dimension
    jpeg: Record<string, string>;  // JPEG file paths by dimension
  };
  altText: string;            // Accessibility alt text
  dateProcessed: string;      // ISO date of processing
  processingVersion: string;  // Processing pipeline version
  sourceInfo: {
    source: string;           // Source platform (Unsplash, etc.)
    photographer?: string;    // Photographer credit
    license: string;          // License type
    originalUrl?: string;     // Source URL if applicable
  };
  validation: {
    tier1: ValidationResult;
    tier2: ValidationResult;
    tier3: ValidationResult;
  };
}

// Cultural validation results
export interface ValidationResult {
  status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
  score?: number;               // 1-5 rating scale
  reviewer?: string;            // Reviewer name/identifier
  reviewDate?: string;          // ISO date of review
  comments?: string;            // Review comments
  culturalNotes?: string;       // Cultural context notes
  issues?: string[];            // Identified issues
  recommendations?: string[];   // Improvement recommendations
}

// Game state types
export type GameStatus = 
  | 'initializing'     // Loading vocabulary and assets
  | 'ready'           // Ready to start, category selection
  | 'starting'        // Shuffling cards, preparing board
  | 'playing'         // Active gameplay
  | 'paused'          // Game paused by user
  | 'checking'        // Validating a match attempt
  | 'celebrating'     // Showing match success animation
  | 'correcting'      // Showing match failure feedback
  | 'completed'       // All matches found successfully
  | 'failed'          // Time limit exceeded or maximum errors
  | 'error';          // Technical error occurred

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface GameConfiguration {
  level: DifficultyLevel;
  name: 'Beginner' | 'Elementary' | 'Intermediate' | 'Upper Intermediate' | 'Advanced';
  wordCount: number;
  timeLimit?: number;         // Optional time limit in seconds
  hintsAvailable: number;
  shuffleComplexity: 'low' | 'medium' | 'high';
  vocabularyComplexity: {
    minLength: number;
    maxLength: number;
    allowCompounds: boolean;
    culturalDepth: 'basic' | 'intermediate' | 'advanced';
  };
}

// Card types for the matching game
export interface Card {
  id: string;
  type: 'picture' | 'word';
  vocabularyId: string;       // Links to VocabularyItem
  position: number;           // Board position
  isSelected: boolean;
  isMatched: boolean;
  isVisible: boolean;
}

export interface MatchPair {
  pictureCard: Card;
  wordCard: Card;
  vocabularyItem: VocabularyItem;
  matchedAt: Date;
  attempts: number;           // Attempts to match this pair
  responseTime: number;       // Time to complete match (ms)
}

// Progress tracking
export interface GameProgress {
  // Session progress
  currentScore: number;
  currentStreak: number;
  longestStreak: number;
  totalMatches: number;
  correctMatches: number;
  incorrectAttempts: number;
  
  // Time tracking
  sessionStartTime: Date;
  totalPlayTime: number;      // milliseconds
  averageMatchTime: number;   // milliseconds
  fastestMatch: number;       // milliseconds
  
  // Learning metrics
  wordsLearned: string[];     // New vocabulary learned
  wordsReviewed: string[];    // Previously learned vocabulary
  difficultyProgression: number; // Current difficulty level
  
  // Achievement tracking
  perfectMatches: number;     // First-try matches
  speedMatches: number;       // Under 5-second matches
  comboMatches: number;       // Streak achievements
}

// User persistence data
export interface UserProgress {
  playerId: string;
  lastPlayed: Date;
  
  // Category progress
  categoryProgress: Map<string, CategoryProgress>;
  overallStats: PlayerStatistics;
  currentDifficulty: DifficultyLevel;
  
  // Settings and preferences
  preferences: PlayerPreferences;
  
  // Current session (if resumable)
  currentSession?: {
    category: string;
    gameState: GameStatus;
    cards: Card[];
    progress: GameProgress;
    timeRemaining?: number;
  };
}

export interface CategoryProgress {
  categoryId: string;
  unlockedWords: string[];
  masteredWords: string[];
  currentLevel: DifficultyLevel;
  bestScore: number;
  totalPlayTime: number;
  gamesPlayed: number;
  averageAccuracy: number;
  lastPlayed: Date;
}

export interface PlayerStatistics {
  totalPlayTime: number;
  totalGamesPlayed: number;
  totalWordsLearned: number;
  averageAccuracy: number;
  longestStreak: number;
  perfectGames: number;
  favoriteCategory: string;
  startDate: Date;
}

export interface PlayerPreferences {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hintPreference: 'visual' | 'cultural' | 'elimination' | 'auto';
  difficultyPreference: 'auto' | 'manual';
  culturalNotesEnabled: boolean;
  pronunciationGuideEnabled: boolean;
  animationsEnabled: boolean;
  darkModeEnabled: boolean;
}

// Cultural context types
export interface CulturalNote {
  id: string;
  vocabularyId: string;
  title: string;
  description: string;
  historicalContext?: string;
  modernUsage?: string;
  regionalVariations?: string;
  culturalSignificance: 'low' | 'medium' | 'high';
  tags: string[];
  verified: boolean;
  sources: string[];
}

// Pronunciation guide
export interface PronunciationGuide {
  vocabularyId: string;
  ipa: string;                // International Phonetic Alphabet
  simplifiedPhonetic?: string; // Simplified pronunciation guide
  audioFile?: string;         // Path to audio file (future)
  tips?: string[];            // Pronunciation tips
  commonMistakes?: string[];  // Common pronunciation errors
  dialects?: {
    region: string;
    pronunciation: string;
    notes?: string;
  }[];
}

// API response types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

export interface VocabularyResponse extends ApiResponse<CategoryData> {}
export interface CategoriesResponse extends ApiResponse<Category[]> {}
export interface ProgressResponse extends ApiResponse<UserProgress> {}

// Error types
export interface GameError {
  type: 'network' | 'validation' | 'content' | 'system';
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  recoverable: boolean;
}

// Utility types for type safety
export type CategoryId = 'animals' | 'colors' | 'food' | 'family' | 'numbers';
export type ImageSize = '140' | '160' | '180' | '360';
export type ImageFormat = 'webp' | 'jpeg' | 'png';

// Component prop types
export interface GameCardProps {
  id: string;
  type: 'picture' | 'word';
  content: string | ImageAsset;
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

export interface CategoryCardProps {
  category: Category;
  progress: CategoryProgress;
  onSelect: (categoryId: string) => void;
  disabled?: boolean;
}

export interface ScorePanelProps {
  currentScore: number;
  streak: number;
  accuracy: number;
  timeElapsed?: number;
  hintsUsed: number;
  maxHints: number;
  showTimer: boolean;
}

// Export utility type for deep readonly
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Type guards for runtime type checking
export function isVocabularyItem(obj: any): obj is VocabularyItem {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.irishWord === 'string' &&
    typeof obj.englishTranslation === 'string' &&
    typeof obj.pronunciation === 'string' &&
    typeof obj.difficultyLevel === 'number' &&
    obj.difficultyLevel >= 1 && obj.difficultyLevel <= 5;
}

export function isCategory(obj: any): obj is Category {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.nameIrish === 'string' &&
    typeof obj.nameEnglish === 'string' &&
    typeof obj.difficultyLevel === 'number' &&
    typeof obj.priority === 'number';
}