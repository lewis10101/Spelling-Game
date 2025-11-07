import React, { useState, useMemo } from 'react';
import { Definitions } from '../../types';
import { Button } from '../ui/Button';
import GameContainer from './GameContainer';
import { RefreshCwIcon } from '../icons';
import { shuffleArray } from '../../utils/helpers';

interface SillySentenceGameProps {
  words: string[];
  definitions: Definitions;
  onReturnToMenu: () => void;
}

const templates = [
    (word: string) => `The ${word} danced on a rainbow while eating spaghetti.`,
    (word: string) => `My pet ${word} can sing opera better than a professional.`,
    (word: string) => `I saw a giant ${word} flying a kite on the moon.`,
    (word: string) => `Why did the ${word} wear a tutu to the grocery store?`,
];

const SillySentenceGame: React.FC<SillySentenceGameProps> = ({ words, onReturnToMenu }) => {
    const shuffledWords = useMemo(() => shuffleArray(words), []);
    const [sentenceId, setSentenceId] = useState(0);

    const sentence = useMemo(() => {
        const word = shuffledWords[sentenceId % shuffledWords.length];
        const template = templates[sentenceId % templates.length];
        return template(word);
    }, [sentenceId, shuffledWords]);

    const generateNewSentence = () => {
        setSentenceId(prev => prev + 1);
    };

    return (
        <GameContainer title="Silly Sentence" onReturnToMenu={onReturnToMenu}>
            <div className="text-center p-6 bg-slate-100 dark:bg-slate-700 rounded-lg min-h-[150px] flex items-center justify-center">
                <p className="text-xl italic text-slate-800 dark:text-slate-200">{sentence}</p>
            </div>
            <div className="mt-6 flex justify-center">
                <Button onClick={generateNewSentence}>
                    <RefreshCwIcon className="w-4 h-4 mr-2"/>
                    New Sentence
                </Button>
            </div>
        </GameContainer>
    );
};

export default SillySentenceGame;