import React, { useState, useEffect, useMemo } from 'react';
import { Definitions } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import GameContainer from './GameContainer';
import { Volume2Icon } from '../icons';
import { shuffleArray } from '../../utils/helpers';

interface ListenTypeGameProps {
  words: string[];
  definitions: Definitions;
  onReturnToMenu: () => void;
}

const ListenTypeGame: React.FC<ListenTypeGameProps> = ({ words, onReturnToMenu }) => {
  const shuffledWords = useMemo(() => shuffleArray(words), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState('');

  const currentWord = shuffledWords[currentIndex];

  useEffect(() => {
    setInputValue('');
    setFeedback('');
  }, [currentIndex]);

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().toLowerCase() === currentWord.toLowerCase()) {
      setFeedback('✅ Correct!');
      setTimeout(() => {
        if (currentIndex < shuffledWords.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setFeedback('🔊 Listen & Type complete!');
        }
      }, 1000);
    } else {
      setFeedback('❌ Incorrect. Try again!');
    }
  };

  if (currentIndex >= shuffledWords.length) {
    return (
      <GameContainer title="Listen & Type" onReturnToMenu={onReturnToMenu}>
        <p className="text-center text-xl">🔊 Listen & Type complete!</p>
      </GameContainer>
    );
  }

  return (
    <GameContainer title="Listen & Type" onReturnToMenu={onReturnToMenu}>
      <div className="text-center">
        <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
          Click the button to listen, then type what you hear.
        </p>
        <Button onClick={() => speakWord(currentWord)} variant="secondary" className="mb-6">
          <Volume2Icon className="w-5 h-5 mr-2" />
          Listen
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type what you heard"
          autoFocus
        />
        <Button type="submit">Submit</Button>
      </form>
      {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
    </GameContainer>
  );
};

export default ListenTypeGame;