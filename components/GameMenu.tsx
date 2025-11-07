import React from 'react';
import { GameMode } from '../types';
import { Button } from './ui/Button';

interface GameMenuProps {
  onSelect: (mode: GameMode) => void;
}

const gameOptions = [
  // New AI Games
  { mode: GameMode.WordLadder, label: '🧠 Word Ladder' },
  { mode: GameMode.WordBuilder, label: '🧩 Word Builder' },
  { mode: GameMode.DefinitionDuel, label: '🎯 Definition Duel' },
  { mode: GameMode.WordDetective, label: '🕵️‍♂️ Word Detective' },
  // Classic Games
  { mode: GameMode.MemoryMatch, label: '🃏 Memory Match' },
  { mode: GameMode.Scramble, label: ' unscramble' },
  { mode: GameMode.Flashcards, label: '📚 Flashcards' },
  { mode: GameMode.TypingRace, label: '⌨️ Typing Race' },
  { mode: GameMode.Quiz, label: '🎓 Spelling Quiz' },
  { mode: GameMode.Hangman, label: '🤔 Hangman' },
  { mode: GameMode.ListenType, label: '🔊 Listen & Type' },
  { mode: GameMode.MatchDefinition, label: '📖 Match Definition' },
  { mode: GameMode.ReverseDefinition, label: '✍️ Reverse Definition' },
  { mode: GameMode.SillySentence, label: '🤪 Silly Sentence' },
];

const GameMenu: React.FC<GameMenuProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {gameOptions.map(option => (
        <Button 
          key={option.mode} 
          onClick={() => onSelect(option.mode)}
          variant="secondary"
          className="text-sm md:text-base h-full p-4 flex-col gap-2"
        >
          <span>{option.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default GameMenu;
