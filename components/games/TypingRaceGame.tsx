import React, { useState, useEffect, useMemo } from 'react';
import { Definitions } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import GameContainer from './GameContainer';
import { shuffleArray } from '../../utils/helpers';

interface TypingRaceGameProps {
  words: string[];
  definitions: Definitions;
  onReturnToMenu: () => void;
}

const TypingRaceGame: React.FC<TypingRaceGameProps> = ({ words, onReturnToMenu }) => {
  const shuffledWords = useMemo(() => shuffleArray(words), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setInputValue('');
    setFeedback('');
  }, [currentIndex]);

  const currentWord = shuffledWords[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().toLowerCase() === currentWord.toLowerCase()) {
      setFeedback('✅ Correct!');
      setTimeout(() => {
        if (currentIndex < shuffledWords.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setFeedback('🏁 Typing race complete!');
          setIsComplete(true);
        }
      }, 1000);
    } else {
      setFeedback('❌ Incorrect. Try again!');
    }
  };

  if (isComplete) {
    return (
      <GameContainer title="Typing Race" onReturnToMenu={onReturnToMenu}>
        <p className="text-center text-xl">🏁 Typing race complete!</p>
      </GameContainer>
    );
  }

  return (
    <GameContainer title="Typing Race" onReturnToMenu={onReturnToMenu}>
      <div className="text-center">
        <p className="text-slate-600 dark:text-slate-400">Type the word:</p>
        <p className="text-4xl font-bold my-4 bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">{currentWord}</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type here"
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <Button type="submit">Submit</Button>
      </form>
      {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
    </GameContainer>
  );
};

export default TypingRaceGame;
