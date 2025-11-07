import React, { useState, useMemo, useCallback } from 'react';
import { Definitions } from '../../types';
import { validateWord } from '../../services/geminiService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import GameContainer from './GameContainer';
import { LoaderIcon } from '../icons';

interface WordLadderGameProps {
  words: string[];
  definitions: Definitions;
  onReturnToMenu: () => void;
}

const isOneLetterApart = (word1: string, word2: string): boolean => {
    if (word1.length !== word2.length) return false;
    let diff = 0;
    for (let i = 0; i < word1.length; i++) {
        if (word1[i] !== word2[i]) {
            diff++;
        }
    }
    return diff === 1;
};

const WordLadderGame: React.FC<WordLadderGameProps> = ({ words, onReturnToMenu }) => {
    const fourLetterWords = useMemo(() => words.filter(w => w.length === 4), [words]);
    const [startWord] = useState(() => fourLetterWords.length > 0 ? fourLetterWords[Math.floor(Math.random() * fourLetterWords.length)] : "cold");
    
    const [path, setPath] = useState<string[]>([startWord]);
    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const currentWord = path[path.length - 1];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newWord = inputValue.trim().toLowerCase();

        if (newWord.length !== 4) {
            setFeedback("❌ Word must be 4 letters long.");
            return;
        }

        if (!isOneLetterApart(currentWord, newWord)) {
            setFeedback("❌ Must change exactly one letter.");
            return;
        }

        setIsLoading(true);
        setFeedback('');
        const isValid = await validateWord(newWord);
        setIsLoading(false);

        if (isValid) {
            setPath([...path, newWord]);
            setInputValue('');
            setFeedback('✅ Nice one!');
        } else {
            setFeedback(`❌ "${newWord}" is not a valid word.`);
        }
    };

    if (fourLetterWords.length === 0 && words.length > 0) {
      return (
        <GameContainer title="Word Ladder" onReturnToMenu={onReturnToMenu}>
          <p className="text-center">This game works best with 4-letter words. Please start a new game with a different word set.</p>
        </GameContainer>
      );
    }

    return (
        <GameContainer title="Word Ladder" onReturnToMenu={onReturnToMenu}>
            <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400 mb-4">Change one letter at a time to make a new valid word.</p>
                <div className="flex flex-col items-center gap-1 my-4">
                    {path.map((word, index) => (
                        <div key={index} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-md font-mono tracking-widest text-lg">
                            {word.toUpperCase()}
                        </div>
                    ))}
                </div>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                <Input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`Change one letter from "${currentWord}"`}
                    autoFocus
                    maxLength={4}
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <><LoaderIcon className="animate-spin mr-2"/> Checking...</> : "Submit"}
                </Button>
            </form>
            {feedback && <p className="text-center mt-4 font-semibold">{feedback}</p>}
        </GameContainer>
    );
};

export default WordLadderGame;
