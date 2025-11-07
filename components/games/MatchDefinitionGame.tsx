import React, { useState, useEffect, useMemo } from 'react';
import { Definitions } from '../../types';
import { shuffleArray } from '../../utils/helpers';
import GameContainer from './GameContainer';
import { Button } from '../ui/Button';

interface MatchDefinitionGameProps {
  words: string[];
  definitions: Definitions;
  onReturnToMenu: () => void;
}

type MatchItem = {
  id: string;
  type: 'word' | 'def';
  value: string;
  word: string;
};

const WORDS_PER_SET = 4;

const MatchDefinitionGame: React.FC<MatchDefinitionGameProps> = ({ words, definitions, onReturnToMenu }) => {
  const shuffledWords = useMemo(() => shuffleArray(words), []);
  const [currentSet, setCurrentSet] = useState(0);
  const [items, setItems] = useState<MatchItem[]>([]);
  const [selected, setSelected] = useState<MatchItem | null>(null);
  const [matchedWords, setMatchedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const setWords = shuffledWords.slice(currentSet * WORDS_PER_SET, (currentSet + 1) * WORDS_PER_SET);
    if (setWords.length < 2) return; 

    const newItems: MatchItem[] = [];
    setWords.forEach((word, index) => {
      newItems.push({ id: `w-${index}`, type: 'word', value: word, word: word });
      newItems.push({ id: `d-${index}`, type: 'def', value: definitions[word] || 'Definition not found.', word: word });
    });

    setItems(shuffleArray(newItems));
    setSelected(null);
    setMatchedWords([]);
    setFeedback('');
  }, [currentSet, definitions, shuffledWords]);

  const handleSelect = (item: MatchItem) => {
    if (matchedWords.includes(item.word)) return;
    if (selected && selected.id === item.id) {
      setSelected(null);
      return;
    }

    if (selected) {
      // Check for match
      if (selected.word === item.word && selected.type !== item.type) {
        setMatchedWords([...matchedWords, item.word]);
        setFeedback('✅ Match!');
      } else {
        setFeedback('❌ Not a match.');
      }
      const tempSelected = selected;
      setSelected(item);
      setTimeout(() => {
        setSelected(null);
        setFeedback('');
      }, 1000);
    } else {
      setSelected(item);
    }
  };

  const isGameComplete = (currentSet + 1) * WORDS_PER_SET >= shuffledWords.length && matchedWords.length === items.length / 2;
  const isSetComplete = items.length > 0 && matchedWords.length === items.length / 2;
  const hasMoreSets = (currentSet + 1) * WORDS_PER_SET < shuffledWords.length;
  
  if (shuffledWords.length < 2) {
    return (
        <GameContainer title="Match the Definition" onReturnToMenu={onReturnToMenu}>
            <p className="text-center">You need at least 2 words for this game.</p>
        </GameContainer>
    );
  }

  if (isGameComplete) {
      return (
          <GameContainer title="Match the Definition" onReturnToMenu={onReturnToMenu}>
              <p className="text-center text-xl">📖 Definition match complete!</p>
          </GameContainer>
      );
  }

  return (
    <GameContainer title="Match the Definition" onReturnToMenu={onReturnToMenu}>
      <p className="text-center text-slate-600 dark:text-slate-400 mb-4">Match each word with its definition.</p>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => {
          const isSelected = selected?.id === item.id;
          const isMatched = matchedWords.includes(item.word);
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              disabled={isMatched}
              className={`p-4 rounded-lg text-left h-full transition-all duration-200 text-sm md:text-base
                ${isMatched ? 'bg-green-200 dark:bg-green-800 opacity-50 cursor-not-allowed' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}
                ${isSelected ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900' : ''}
              `}
            >
              {item.value}
            </button>
          );
        })}
      </div>
      {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
      {isSetComplete && hasMoreSets && (
        <div className="text-center mt-6">
            <Button onClick={() => setCurrentSet(currentSet + 1)}>Next Set</Button>
        </div>
      )}
    </GameContainer>
  );
};

export default MatchDefinitionGame;