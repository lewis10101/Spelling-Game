import React, { useState, useMemo, useEffect } from 'react';
import { Definitions } from '../../types';
import { shuffleArray } from '../../utils/helpers';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import GameContainer from './GameContainer';

interface ScrambleGameProps {
  words: string[];
  definitions: Definitions;
  onReturnToMenu: () => void;
}

const ScrambleGame: React.FC<ScrambleGameProps> = ({ words, onReturnToMenu }) => {
  const shuffledWords = useMemo(() => shuffleArray(words), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState('');
  
  const currentWord = shuffledWords[currentIndex];
  const scrambledWord = useMemo(() => {
    if (!currentWord) return '';
    let shuffled = shuffleArray(currentWord.split('')).join('');
    while (shuffled === currentWord) {
      shuffled = shuffleArray(currentWord.split('')).join('');
    }
    return shuffled;
  }, [currentWord]);

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
          setFeedback("🎉 Scramble complete!");
        }
      }, 1000);
    } else {
      setFeedback(`❌ Incorrect. Try again!`);
    }
  };

  if (currentIndex >= shuffledWords.length) {
    return (
        <GameContainer title="Word Scramble" onReturnToMenu={onReturnToMenu}>
            <p className="text-center text-xl">🎉 Scramble complete!</p>
        </GameContainer>
    );
  }

  return (
    <GameContainer title="Word Scramble" onReturnToMenu={onReturnToMenu}>
        <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400">Unscramble the word:</p>
            <p className="text-4xl font-bold tracking-widest my-4 bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">{scrambledWord}</p>
        </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <Input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Your answer"
          autoFocus
        />
        <Button type="submit">Submit</Button>
      </form>
      {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
    </GameContainer>
  );
};

export default ScrambleGame;