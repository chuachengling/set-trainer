// SET card properties
export type Color = 'red' | 'green' | 'purple';
export type Shape = 'diamond' | 'oval' | 'squiggle';
export type Fill = 'solid' | 'striped' | 'empty';
export type Count = 1 | 2 | 3;

export interface Card {
  color: Color;
  shape: Shape;
  fill: Fill;
  count: Count;
}

export type GameMode = 'find-card' | 'validate-set';

export type Difficulty = 'super-easy' | 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  timeLimit: number; // seconds
  label: string;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultyConfig> = {
  'super-easy': { timeLimit: 15, label: 'Super Easy' },
  easy: { timeLimit: 12, label: 'Easy' },
  medium: { timeLimit: 7, label: 'Medium' },
  hard: { timeLimit: 3, label: 'Hard' }
};
