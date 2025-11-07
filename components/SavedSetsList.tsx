
import React from 'react';
import { Button } from './ui/Button';
import { TrashIcon } from './icons';

interface SavedSetsListProps {
  savedSets: Record<string, string[]>;
  onSelectSet: (words: string[]) => void;
  onDeleteSet: (setName: string) => void;
  isLoading: boolean;
}

const SavedSetsList: React.FC<SavedSetsListProps> = ({ savedSets, onSelectSet, onDeleteSet, isLoading }) => {
  const setNames = Object.keys(savedSets);

  if (setNames.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold text-center mb-4">Or Use a Saved Set</h2>
      <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2">
        {setNames.map(setName => (
          <div key={setName} className="flex items-center gap-2">
            <Button 
              onClick={() => onSelectSet(savedSets[setName])}
              variant="secondary"
              className="w-full justify-start text-left"
              disabled={isLoading}
            >
              <span className="truncate">{setName} ({savedSets[setName].length} words)</span>
            </Button>
            <button 
              onClick={() => onDeleteSet(setName)}
              className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0 disabled:opacity-50"
              aria-label={`Delete set ${setName}`}
              disabled={isLoading}
            >
              <TrashIcon className="w-5 h-5"/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedSetsList;