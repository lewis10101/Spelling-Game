import React, { useState, useMemo } from 'react';
import { Definitions } from '../../types';
import { shuffleArray } from '../../utils/helpers';
import { Button } from '../ui/Button';
import GameContainer from './GameContainer';
import { ArrowRightIcon } from '../icons';

interface FlashcardGameProps {
  words: string[];
  definitions: Definitions;
  onReturnToMenu: () => void;
}

const FlashcardGame: React.FC<FlashcardGameProps> = ({ words, definitions, onReturnToMenu }) => {
  const shuffledWords = useMemo(() => shuffleArray(words), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };
  
  const currentWord = shuffledWords[currentIndex];

  if (currentIndex >= shuffledWords.length) {
    return (
      <GameContainer title="Flashcards" onReturnToMenu={onReturnToMenu}>
        <p className="text-center text-xl">📚 Flashcards complete!</p>
      </GameContainer>
    );
  }

  return (
    <GameContainer title="Flashcards" onReturnToMenu={onReturnToMenu}>
      <div className="text-center">
        <p className="mb-4 text-slate-600 dark:text-slate-400">
          Card {currentIndex + 1} of {shuffledWords.length}
        </p>
        <div 
            className="w-full h-64 border-2 border-blue-400 dark:border-blue-600 rounded-xl flex flex-col justify-center items-center p-4 cursor-pointer bg-slate-100 dark:bg-slate-700"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ perspective: '1000px' }}
        >
          <div className={`relative w-full h-full transition-transform duration-500`} style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : '' }}>
            <div className="absolute w-full h-full flex justify-center items-center" style={{ backfaceVisibility: 'hidden'}}>
                <p className="text-4xl font-bold">{currentWord}</p>
            </div>
            <div className="absolute w-full h-full flex justify-center items-center px-4" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}}>
                <p className="text-lg italic">{definitions[currentWord] || "Definition not found."}</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-2">Click card to flip</p>

        {currentIndex < shuffledWords.length - 1 && (
          <Button onClick={handleNext} className="mt-6">
            Next <ArrowRightIcon className="w-4 h-4 ml-2"/>
          </Button>
        )}
      </div>
    </GameContainer>
  );
};

export default FlashcardGame;