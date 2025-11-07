
import React, { useState, useMemo } from 'react';
import { Definitions } from '../../types';
import { validateWord } from '../../services/geminiService';
import { shuffleArray } from '../../utils/helpers';
import GameContainer from './GameContainer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoaderIcon, RefreshCwIcon } from '../icons';

interface WordBuilderGameProps {
  words: string[];
  definitions: Definitions;
  onReturnToMenu: () => void;
}

const canMakeWord = (word: string, letters: string[]) => {
    const tempLetters = [...letters];
    for (const char of word) {
        const index = tempLetters.indexOf(char);
        if (index === -1) return false;
        tempLetters.splice(index, 1);
    }
    return true;
};

const WordBuilderGame: React.FC<WordBuilderGameProps> = ({ words, onReturnToMenu }) => {
    const longWords = useMemo(() => words.filter(w => w.length >= 5), [words]);
    
    const [sourceWord, setSourceWord] = useState(() => longWords.length > 0 ? longWords[Math.floor(Math.random() * longWords.length)] : "example");
    const [letters, setLetters] = useState(() => shuffleArray(sourceWord.split('')));
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const resetGame = () => {
        const newWord = longWords.length > 0 ? longWords[Math.floor(Math.random() * longWords.length)] : "example";
        setSourceWord(newWord);
        setLetters(shuffleArray(newWord.split('')));
        setFoundWords([]);
        setInputValue('');
        setFeedback('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newWord = inputValue.trim().toLowerCase();

        if (newWord.length < 3) {
            setFeedback("❌ Words must be at least 3 letters long.");
            return;
        }
        if (foundWords.includes(newWord)) {
            setFeedback("👍 You already found that one!");
            return;
        }
        if (!canMakeWord(newWord, letters)) {
            setFeedback("❌ You can only use the letters provided.");
            return;
        }

        setIsLoading(true);
        setFeedback('');
        const isValid = await validateWord(newWord);
        setIsLoading(false);

        if (isValid) {
            setFoundWords(prev => [...prev, newWord].sort());
            setInputValue('');
            setFeedback(`✅ Added "${newWord}"!`);
        } else {
            setFeedback(`❌ "${newWord}" is not a valid word.`);
        }
    };
    
    if (longWords.length === 0 && words.length > 0) {
        return (
          <GameContainer title="Word Builder" onReturnToMenu={onReturnToMenu}>
            <p className="text-center">This game needs words with 5 or more letters. Please start a new game with a different word set.</p>
          </GameContainer>
        );
      }

    return (
        <GameContainer title="Word Builder" onReturnToMenu={onReturnToMenu}>
            <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-2">Make words using these letters:</p>
                <div className="flex justify-center gap-2 my-4">
                    {letters.map((letter, index) => (
                        <div key={index} className="w-10 h-10 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-md text-2xl font-bold uppercase">
                            {letter}
                        </div>
                    ))}
                </div>
                {/* Fix: Removed unsupported 'size' prop from Button component. */}
                <Button onClick={resetGame} variant="secondary" className="text-xs py-1 px-2">
                    <RefreshCwIcon className="w-3 h-3 mr-1"/> New Letters
                </Button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 my-4">
                <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a word"
                    autoFocus
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <><LoaderIcon className="animate-spin mr-2"/> Checking...</> : "Submit Word"}
                </Button>
            </form>
            {feedback && <p className="text-center my-2 font-semibold">{feedback}</p>}
            {foundWords.length > 0 && (
                <div>
                    <h4 className="font-semibold text-center">Found Words: {foundWords.length}</h4>
                    <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg max-h-32 overflow-y-auto flex flex-wrap gap-2 justify-center">
                        {foundWords.map(word => (
                            <span key={word} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-md text-sm">
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </GameContainer>
    );
};

export default WordBuilderGame;
