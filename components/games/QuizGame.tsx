import React, { useState, useMemo, useEffect } from 'react';
import { Definitions } from '../../types';
import { shuffleArray } from '../../utils/helpers';
import { Button } from '../ui/Button';
import GameContainer from './GameContainer';

interface QuizGameProps {
  words: string[];
  definitions: Definitions;
  onReturnToMenu: () => void;
}

const getFakeWords = (correctWord: string): string[] => {
  const fakes = new Set<string>();
  while (fakes.size < 3) {
    const fake = shuffleArray(correctWord.split('')).join('');
    if (fake !== correctWord) {
      fakes.add(fake);
    }
  }
  return Array.from(fakes);
};

const QuizGame: React.FC<QuizGameProps> = ({ words, definitions, onReturnToMenu }) => {
  const shuffledWords = useMemo(() => shuffleArray(words), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selected, setSelected] = useState('');

  const currentWord = shuffledWords[currentIndex];

  const options = useMemo(() => {
    if (!currentWord) return [];
    return shuffleArray([currentWord, ...getFakeWords(currentWord)]);
  }, [currentWord]);
  
  useEffect(() => {
      setFeedback('');
      setSelected('');
  }, [currentIndex]);
  
  const handleCheck = (selectedOption: string) => {
    setSelected(selectedOption);
    if (selectedOption === currentWord) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Incorrect. The correct spelling is "${currentWord}".`);
    }

    setTimeout(() => {
      if (currentIndex < shuffledWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFeedback("🎓 Quiz complete!");
      }
    }, 2000);
  };

  if (currentIndex >= shuffledWords.length) {
    return (
      <GameContainer title="Quiz Mode" onReturnToMenu={onReturnToMenu}>
        <p className="text-center text-xl">🎓 Quiz complete!</p>
      </GameContainer>
    );
  }

  return (
    <GameContainer title="Quiz Mode" onReturnToMenu={onReturnToMenu}>
      <div className="text-center">
        <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
          Choose the correct spelling for the definition:
        </p>
        <p className="italic bg-slate-100 dark:bg-slate-700 p-4 rounded-lg mb-6">
            "{definitions[currentWord] || 'No definition available.'}"
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((opt, index) => (
            <Button
              key={index}
              variant="secondary"
              onClick={() => handleCheck(opt)}
              disabled={!!selected}
              className={`
                justify-start p-4 text-left h-full
                ${selected && opt === currentWord ? 'bg-green-200 dark:bg-green-800 border-green-500' : ''}
                ${selected === opt && opt !== currentWord ? 'bg-red-200 dark:bg-red-800 border-red-500' : ''}
              `}
            >
              {opt}
            </Button>
          ))}
        </div>
        {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
      </div>
    </GameContainer>
  );
};

export default QuizGame;