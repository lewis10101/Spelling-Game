import React from 'react';

export enum GameMode {
  None,
  // New Games
  WordLadder,
  WordBuilder,
  DefinitionDuel,
  WordDetective,
  MemoryMatch,
  // Classic Games
  Scramble,
  Hangman,
  TypingRace,
  SillySentence,
  Flashcards,
  Quiz,
  ListenType,
  MatchDefinition,
  ReverseDefinition,
}

export type Definitions = Record<string, string>;

// Fix: Add missing AchievementID and Achievement types.
export type AchievementID = string;

export interface Achievement {
  name: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}
