
export enum Role {
  CIVILIAN = 'CIVILIAN',
  SPY = 'SPY',
  BLANK = 'BLANK',
}

export interface WordPair {
  civilian: string;
  spy: string;
}

export interface Player {
  id: number;
  role: Role;
  word: string;
  isRevealed: boolean;
  isEliminated: boolean; // New property
}

export interface GameSettings {
  totalPlayers: number;
  spyCount: number;
  blankCount: number;
  wordPair: WordPair;
  categoryName: string;
  categoryId: string; // Added to track source for re-rolling
  customWordBank?: WordPair[]; // Added to store custom lists for re-rolling
}

export enum AppScreen {
  SETUP = 'SETUP',
  CATEGORY = 'CATEGORY',
  PASS_PLAY = 'PASS_PLAY',
  READY = 'READY',
  VOTING = 'VOTING', // New Screen
  RESULT = 'RESULT',
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  sourceUrl?: string;
}

export enum Winner {
  CIVILIAN = 'CIVILIAN',
  SPY = 'SPY',
  BLANK = 'BLANK',
  NONE = 'NONE'
}
