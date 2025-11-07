import React, { useState, useEffect, useMemo } from 'react';
import { Definitions } from '../../types';
import GameContainer from './GameContainer';
import { generateParagraphWithWords } from '../../services/geminiService';
import { shuffleArray } from '../../utils/helpers';
import { LoaderIcon } from '../icons';

interface WordDetectiveGameProps {
  words: string[];
  definitions: Definitions;
  onReturnToMenu: () => void;
}

const WordDetectiveGame: React.FC<WordDetectiveGameProps> = ({ words, onReturnToMenu }) => {
    const wordsToFind = useMemo(() => shuffleArray(words).slice(0, 5), [words]);
    const [paragraph, setParagraph] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    
    useEffect(() => {
        const generate = async () => {
            setIsLoading(true);
            const p = await generateParagraphWithWords(wordsToFind.map(w => w.toLowerCase()));
            setParagraph(p);
            setIsLoading(false);
        };
        if (wordsToFind.length > 0) {
            generate();
        } else {
            setIsLoading(false);
        }
    }, []);

    const handleWordClick = (word: string) => {
        const cleanWord = word.replace(/[.,!?]/g, '').toLowerCase();
        const originalWord = wordsToFind.find(w => w.toLowerCase() === cleanWord);
        if (originalWord && !foundWords.includes(originalWord)) {
            setFoundWords(prev => [...prev, originalWord]);
        }
    };
    
    const isComplete = foundWords.length === wordsToFind.length;

    if (isLoading) {
        return (
            <GameContainer title="Word Detective" onReturnToMenu={onReturnToMenu}>
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                    <LoaderIcon className="w-8 h-8 animate-spin mb-4" />
                    <p>Generating your mystery paragraph...</p>
                </div>
            </GameContainer>
        );
    }
    
    if (wordsToFind.length === 0) {
        return (
            <GameContainer title="Word Detective" onReturnToMenu={onReturnToMenu}>
                <p className="text-center">You need to provide words to play this game.</p>
            </GameContainer>
        );
    }

    return (
        <GameContainer title="Word Detective" onReturnToMenu={onReturnToMenu}>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-4">Find and click the hidden words in the paragraph below.</p>
            
            <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-lg leading-relaxed">
                {paragraph.split(' ').map((word, index) => {
                    const cleanWord = word.replace(/[.,!?]/g, '').toLowerCase();
                    const isFound = wordsToFind.some(w => w.toLowerCase() === cleanWord && foundWords.includes(w));
                    
                    return (
                        <span 
                            key={index} 
                            onClick={() => handleWordClick(word)}
                            className={`cursor-pointer transition-colors ${isFound ? 'bg-yellow-300 dark:bg-yellow-600 rounded-md px-1' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                        >
                            {word}{' '}
                        </span>
                    );
                })}
            </div>
            
            <div className="mt-4">
                <h4 className="font-semibold text-center">Words to Find ({foundWords.length}/{wordsToFind.length})</h4>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {wordsToFind.map(word => (
                        <span key={word} className={`px-2 py-1 rounded-md text-sm ${foundWords.includes(word) ? 'bg-green-200 dark:bg-green-800 line-through' : 'bg-slate-200 dark:bg-slate-600'}`}>
                            {word}
                        </span>
                    ))}
                </div>
            </div>

            {isComplete && (
                <p className="text-center mt-6 text-xl font-bold text-green-600 dark:text-green-400">
                    🎉 Case Solved! You found all the words!
                </p>
            )}
        </GameContainer>
    );
};

export default WordDetectiveGame;
