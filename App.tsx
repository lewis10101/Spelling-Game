import React, { useState, useCallback, useEffect } from 'react';
import { GameMode, Definitions } from './types';
import { fetchDefinitions as fetchDefsFromGemini } from './services/geminiService';

import WordInputForm from './components/WordInputForm';
import GameMenu from './components/GameMenu';
import SavedSetsList from './components/SavedSetsList';

// New Games
import MemoryMatchGame from './components/games/MemoryMatchGame';
import WordLadderGame from './components/games/WordLadderGame';
import WordBuilderGame from './components/games/WordBuilderGame';
import DefinitionDuelGame from './components/games/DefinitionDuelGame';
import WordDetectiveGame from './components/games/WordDetectiveGame';

// Classic Games
import ScrambleGame from './components/games/ScrambleGame';
import HangmanGame from './components/games/HangmanGame';
import TypingRaceGame from './components/games/TypingRaceGame';
import SillySentenceGame from './components/games/SillySentenceGame';
import FlashcardGame from './components/games/FlashcardGame';
import QuizGame from './components/games/QuizGame';
import ListenTypeGame from './components/games/ListenTypeGame';
import MatchDefinitionGame from './components/games/MatchDefinitionGame';
import ReverseDefinitionGame from './components/games/ReverseDefinitionGame';


import { SparklesIcon, AlertTriangleIcon, ArrowLeftIcon, SunIcon, MoonIcon } from './components/icons';

type View = 'WORD_INPUT' | 'GAME_MENU' | 'GAME';

const App: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const [definitions, setDefinitions] = useState<Definitions>({});
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.None);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('WORD_INPUT');
  const [savedSets, setSavedSets] = useState<Record<string, string[]>>({});

  // New state for features
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // Theme
      const savedTheme = localStorage.getItem('spellingSparkTheme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
      // Other data
      const storedSets = localStorage.getItem('spellingSparkSets');
      if (storedSets) setSavedSets(JSON.parse(storedSets));
      
    } catch (e) {
      console.error("Failed to load from localStorage", e);
    }
  }, []);

  // Stopwatch effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(time => time + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save dark mode preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('spellingSparkTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('spellingSparkTheme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const updateSavedSets = (newSets: Record<string, string[]>) => {
    setSavedSets(newSets);
    try {
      localStorage.setItem('spellingSparkSets', JSON.stringify(newSets));
    } catch (e) {
      console.error("Failed to save sets to localStorage", e);
    }
  };

  const prepareGame = useCallback(async (wordList: string[]) => {
    if (wordList.length === 0) return;
    setIsLoading(true);
    setError(null);
    setWords(wordList);

    try {
      const defs = await fetchDefsFromGemini(wordList);
      setDefinitions(defs);
      setCurrentView('GAME_MENU');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch definitions. Please check your API key and try again.');
      setCurrentView('WORD_INPUT');
      setWords([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaveNewWords = useCallback(async (wordList: string[]) => {
    const setName = wordList.slice(0, 3).join(', ') + (wordList.length > 3 ? '...' : '');
    if (!savedSets[setName]) {
      const newSets = { ...savedSets, [setName]: wordList };
      updateSavedSets(newSets);
    }
    await prepareGame(wordList);
  }, [prepareGame, savedSets]);

  const handleSelectSet = useCallback(async (wordList: string[]) => {
    await prepareGame(wordList);
  }, [prepareGame]);

  const handleDeleteSet = (setName: string) => {
    const newSets = { ...savedSets };
    delete newSets[setName];
    updateSavedSets(newSets);
  };

  const handleSelectGameMode = (mode: GameMode) => {
    setGameMode(mode);
    setCurrentView('GAME');
  };
  
  const handleReturnToMenu = () => {
    setGameMode(GameMode.None);
    setCurrentView('GAME_MENU');
  };

  const handleReturnToWordInput = () => {
    setWords([]);
    setDefinitions({});
    setGameMode(GameMode.None);
    setError(null);
    setCurrentView('WORD_INPUT');
  };

  const renderGame = () => {
    const gameProps = { words, definitions, onReturnToMenu: handleReturnToMenu };
    switch (gameMode) {
      case GameMode.MemoryMatch:
        return <MemoryMatchGame {...gameProps} />;
      case GameMode.WordLadder:
        return <WordLadderGame {...gameProps} />;
      case GameMode.WordBuilder:
        return <WordBuilderGame {...gameProps} />;
      case GameMode.DefinitionDuel:
        return <DefinitionDuelGame {...gameProps} />;
      case GameMode.WordDetective:
        return <WordDetectiveGame {...gameProps} />;
      case GameMode.Scramble:
        return <ScrambleGame {...gameProps} />;
      case GameMode.Hangman:
        return <HangmanGame {...gameProps} />;
      case GameMode.TypingRace:
        return <TypingRaceGame {...gameProps} />;
      case GameMode.SillySentence:
        return <SillySentenceGame {...gameProps} />;
      case GameMode.Flashcards:
        return <FlashcardGame {...gameProps} />;
      case GameMode.Quiz:
        return <QuizGame {...gameProps} />;
      case GameMode.ListenType:
        return <ListenTypeGame {...gameProps} />;
      case GameMode.MatchDefinition:
        return <MatchDefinitionGame {...gameProps} />;
      case GameMode.ReverseDefinition:
        return <ReverseDefinitionGame {...gameProps} />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (currentView === 'GAME') {
      return renderGame();
    }

    if (currentView === 'GAME_MENU') {
      return (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Choose a Game</h2>
            <button
              onClick={handleReturnToWordInput}
              className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1"/> Change Word Set
            </button>
          </div>
          <GameMenu onSelect={handleSelectGameMode} />
        </>
      );
    }

    return (
      <>
        <WordInputForm onSave={handleSaveNewWords} isLoading={isLoading} />
        {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2">
            <AlertTriangleIcon className="w-5 h-5"/>
            <span>{error}</span>
            </div>
        )}
        <SavedSetsList 
            savedSets={savedSets}
            onSelectSet={handleSelectSet}
            onDeleteSet={handleDeleteSet}
            isLoading={isLoading}
        />
      </>
    );
  };
  
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-900 font-sans">
      <main className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8 relative">
          <div className="absolute top-0 right-0 flex items-center gap-2 md:gap-4">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 hidden sm:block">
                Session: {formatTime(sessionTime)}
            </div>
            <button onClick={toggleDarkMode} className="p-2 rounded-full bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                {isDarkMode ? <SunIcon className="w-5 h-5"/> : <MoonIcon className="w-5 h-5"/>}
            </button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2">
            Spelling Spark <SparklesIcon className="w-8 h-8 text-yellow-400" />
          </h1>
        </header>
        
        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-2xl p-6 md:p-8 transition-all duration-300">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center mt-8 text-slate-500 dark:text-slate-400 text-sm">
        <p>Powered by React, Tailwind CSS, and Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;
