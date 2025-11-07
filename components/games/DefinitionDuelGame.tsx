import React, { useState, useMemo, useEffect } from 'react';
import { Definitions } from '../../types';
import { shuffleArray } from '../../utils/helpers';
import GameContainer from './GameContainer';
import { Button } from '../ui/Button';

interface DefinitionDuelGameProps {
  words: string[];
  definitions: Definitions;
  onReturnToMenu: () => void;
}

type Option = {
    definition: string;
    isCorrect: boolean;
};

const DefinitionDuelGame: React.FC<DefinitionDuelGameProps> = ({ words, definitions, onReturnToMenu }) => {
  const shuffledWords = useMemo(() => shuffleArray(words), [words]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const currentWord = shuffledWords[currentIndex];

  useEffect(() => {
    setFeedback('');
    setSelected(null);
  }, [currentIndex]);

  const options = useMemo(() => {
    if (!currentWord || words.length < 2) {
      return [];
    }
    
    const realDef = definitions[currentWord];

    // Find another word for the "wrong" definition
    const otherWords = words.filter(w => w.toLowerCase() !== currentWord.toLowerCase());
    const imposterWord = otherWords[Math.floor(Math.random() * otherWords.length)];
    const fakeDef = definitions[imposterWord];

    return shuffleArray([
        { definition: realDef, isCorrect: true },
        { definition: fakeDef, isCorrect: false }
    ]);
  }, [currentWord, words, definitions]);

  const handleCheck = (selectedOption: Option) => {
    setSelected(selectedOption.definition);
    if (selectedOption.isCorrect) {
      setFeedback('✅ Correct!');
    } else {
      setFeedback('❌ Incorrect!');
    }

    setTimeout(() => {
      if (currentIndex < shuffledWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFeedback("🎉 Duel complete!");
      }
    }, 2000);
  };

  if (words.length < 2) {
    return (
        <GameContainer title="Definition Duel" onReturnToMenu={onReturnToMenu}>
            <p className="text-center">You need at least 2 words for this game.</p>
        </GameContainer>
    );
  }

  if (currentIndex >= shuffledWords.length) {
    return (
      <GameContainer title="Definition Duel" onReturnToMenu={onReturnToMenu}>
        <p className="text-center text-xl">🎉 Duel complete!</p>
      </GameContainer>
    );
  }

  return (
    <GameContainer title="Definition Duel" onReturnToMenu={onReturnToMenu}>
      <div className="text-center">
        <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
          Which is the correct definition for:
        </p>
        <h3 className="text-3xl font-bold mb-6">{currentWord}</h3>
        
        <div className="grid grid-cols-1 gap-4">
        {options.map((opt, index) => (
            <Button
            key={index}
            variant="secondary"
            onClick={() => handleCheck(opt)}
            disabled={!!selected}
            className={`
                justify-start p-4 text-left h-full text-base
                ${selected && opt.isCorrect ? 'bg-green-200 dark:bg-green-800 border-green-500' : ''}
                ${selected === opt.definition && !opt.isCorrect ? 'bg-red-200 dark:bg-red-800 border-red-500' : ''}
            `}
            >
            {opt.definition}
            </Button>
        ))}
        </div>
        {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
      </div>
    </GameContainer>
  );
};

export default DefinitionDuelGame;