import React, { useState, useMemo, useEffect } from 'react';
import { Definitions } from '../../types';
import { shuffleArray } from '../../utils/helpers';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import GameContainer from './GameContainer';

interface ReverseDefinitionGameProps {
  words: string[];
  definitions: Definitions;
  onReturnToMenu: () => void;
}

const ReverseDefinitionGame: React.FC<ReverseDefinitionGameProps> = ({ words, definitions, onReturnToMenu }) => {
  const shuffledWords = useMemo(() => shuffleArray(words), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const currentWord = shuffledWords[currentIndex];

  useEffect(() => {
    setInputValue('');
    setFeedback('');
  }, [currentIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().toLowerCase() === currentWord.toLowerCase()) {
      setFeedback('✅ Correct!');
      setTimeout(() => {
        if (currentIndex < shuffledWords.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setFeedback('🎉 You guessed them all!');
          setIsComplete(true);
        }
      }, 1000);
    } else {
      setFeedback(`❌ Incorrect. The answer was "${currentWord}".`);
      setTimeout(() => {
        if (currentIndex < shuffledWords.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setFeedback('🎉 Game Over!');
          setIsComplete(true);
        }
      }, 1500);
    }
  };

  if (isComplete) {
    return (
      <GameContainer title="Reverse Definition" onReturnToMenu={onReturnToMenu}>
        <p className="text-center text-xl">{feedback}</p>
      </GameContainer>
    );
  }

  if (!currentWord) {
    return (
        <GameContainer title="Reverse Definition" onReturnToMenu={onReturnToMenu}>
            <p className="text-center">Loading game...</p>
        </GameContainer>
    );
  }

  return (
    <GameContainer title="Reverse Definition" onReturnToMenu={onReturnToMenu}>
      <div className="text-center">
        <p className="text-slate-600 dark:text-slate-400 mb-2">Guess the word for this definition:</p>
        <p className="text-lg italic bg-slate-100 dark:bg-slate-700 p-4 rounded-lg min-h-[100px] flex items-center justify-center">
          "{definitions[currentWord]}"
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Your answer"
          autoFocus
          autoComplete="off"
        />
        <Button type="submit">Submit</Button>
      </form>
      {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
    </GameContainer>
  );
};

export default ReverseDefinitionGame;
