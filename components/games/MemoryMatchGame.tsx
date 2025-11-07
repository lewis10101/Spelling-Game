import React, { useState, useEffect, useMemo } from 'react';
import { Definitions } from '../../types';
import { shuffleArray } from '../../utils/helpers';
import GameContainer from './GameContainer';

interface MemoryMatchGameProps {
  words: string[];
  definitions: Definitions;
  onReturnToMenu: () => void;
}

type Card = {
    id: number;
    type: 'word' | 'definition';
    content: string;
    word: string;
};

const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ words, definitions, onReturnToMenu }) => {
    const gameWords = useMemo(() => shuffleArray(words).slice(0, 6), [words]);
    
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedWords, setMatchedWords] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (gameWords.length > 0) {
            const initialCards: Card[] = [];
            gameWords.forEach((word, i) => {
                initialCards.push({ id: i * 2, type: 'word', content: word, word });
                initialCards.push({ id: i * 2 + 1, type: 'definition', content: definitions[word], word });
            });
            setCards(shuffleArray(initialCards));
            setMatchedWords([]);
            setFlippedIndices([]);
            setIsComplete(false);
        }
    }, [gameWords, definitions]);

    useEffect(() => {
        if (flippedIndices.length === 2) {
            const [firstIndex, secondIndex] = flippedIndices;
            const firstCard = cards[firstIndex];
            const secondCard = cards[secondIndex];

            if (firstCard.word === secondCard.word && firstCard.type !== secondCard.type) {
                setTimeout(() => setMatchedWords(prev => [...prev, firstCard.word]), 300);
            }
            
            setTimeout(() => setFlippedIndices([]), 1200);
        }
    }, [flippedIndices, cards]);
    
    useEffect(() => {
        if (gameWords.length > 0 && matchedWords.length === gameWords.length) {
            setIsComplete(true);
        }
    }, [matchedWords, gameWords]);

    const handleCardClick = (index: number) => {
        if (flippedIndices.length < 2 && !flippedIndices.includes(index) && !matchedWords.includes(cards[index].word)) {
            setFlippedIndices(prev => [...prev, index]);
        }
    };
    
    if (words.length < 2) {
        return <GameContainer title="Memory Match" onReturnToMenu={onReturnToMenu}><p className="text-center">You need at least 2 words for this game.</p></GameContainer>;
    }
    
    if (isComplete) {
        return <GameContainer title="Memory Match" onReturnToMenu={onReturnToMenu}>
            <p className="text-center text-xl">🎉 Memory Master!</p>
        </GameContainer>
    }

    return (
        <GameContainer title="Memory Match" onReturnToMenu={onReturnToMenu}>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-4">Flip cards to match words with their definitions.</p>
            <div className={`grid gap-4 ${cards.length > 8 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                {cards.map((card, index) => {
                    const isFlipped = flippedIndices.includes(index);
                    const isMatched = matchedWords.includes(card.word);
                    return (
                        <div key={card.id} className="w-full h-24 cursor-pointer" style={{ perspective: '1000px' }} onClick={() => handleCardClick(index)}>
                            <div 
                                className="relative w-full h-full text-center transition-transform duration-500"
                                style={{ transformStyle: 'preserve-3d', transform: isFlipped || isMatched ? 'rotateY(180deg)' : '' }}
                            >
                                <div className="absolute w-full h-full flex justify-center items-center bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg text-white text-3xl font-bold" style={{ backfaceVisibility: 'hidden'}}>?</div>
                                <div className={`absolute w-full h-full flex justify-center items-center p-2 text-xs md:text-sm rounded-lg ${isMatched ? 'bg-green-200 dark:bg-green-800' : 'bg-slate-200 dark:bg-slate-700'}`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)'}}>{card.content}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </GameContainer>
    );
};

export default MemoryMatchGame;
