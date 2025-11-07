
import React, { useState, useMemo, useEffect } from 'react';
import { Definitions } from '../../types';
import { Button } from '../ui/Button';
import GameContainer from './GameContainer';

interface HangmanGameProps {
  words: string[];
  definitions: Definitions;
  onReturnToMenu: () => void;
}

const HangmanGame: React.FC<HangmanGameProps> = ({ words, onReturnToMenu }) => {
  const [hangedWord, setHangedWord] = useState(() => words[Math.floor(Math.random() * words.length)].toLowerCase());
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);

  const MAX_MISTAKES = 6;
  
  const displayWord = useMemo(() => {
    return hangedWord.split('').map(letter => (guessedLetters.includes(letter) ? letter : '_')).join(' ');
  }, [hangedWord, guessedLetters]);

  const isWin = useMemo(() => !displayWord.includes('_'), [displayWord]);
  const isLoss = useMemo(() => mistakes >= MAX_MISTAKES, [mistakes]);

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || isWin || isLoss) return;
    
    setGuessedLetters([...guessedLetters, letter]);
    if (!hangedWord.includes(letter)) {
      setMistakes(mistakes + 1);
    }
  };
  
  const resetGame = () => {
    setHangedWord(words[Math.floor(Math.random() * words.length)].toLowerCase());
    setGuessedLetters([]);
    setMistakes(0);
  }

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  
  return (
    <GameContainer title="Hangman" onReturnToMenu={onReturnToMenu}>
      <div className="text-center">
        <p className="text-3xl tracking-widest font-mono mb-4">{displayWord}</p>
        <p className="text-slate-600 dark:text-slate-400">Mistakes: {mistakes} / {MAX_MISTAKES}</p>

        {isWin && <p className="text-green-500 text-xl font-bold mt-4">🎉 You won!</p>}
        {isLoss && <p className="text-red-500 text-xl font-bold mt-4">😢 You lost. The word was: {hangedWord}</p>}

        {(isWin || isLoss) ? (
            <Button onClick={resetGame} className="mt-4">Play Again</Button>
        ) : (
            <div className="flex flex-wrap gap-2 justify-center mt-6">
            {alphabet.map(letter => (
                <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={guessedLetters.includes(letter)}
                className="w-8 h-8 md:w-10 md:h-10 rounded-md bg-blue-100 dark:bg-slate-700 text-blue-800 dark:text-slate-200 font-bold uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-200 dark:hover:bg-slate-600"
                >
                {letter}
                </button>
            ))}
            </div>
        )}
      </div>
    </GameContainer>
  );
};

export default HangmanGame;
