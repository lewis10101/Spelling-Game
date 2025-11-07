
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { LoaderIcon } from './icons';


interface WordInputFormProps {
  onSave: (words: string[]) => void;
  isLoading: boolean;
}

const WordInputForm: React.FC<WordInputFormProps> = ({ onSave, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const words = text.split('\n').map(w => w.trim()).filter(w => w.length > 0);
    onSave(words);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="wordInput" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Enter Words (one per line)
      </label>
      <Textarea
        id="wordInput"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="apple&#10;banana&#10;celebrate..."
        rows={6}
        disabled={isLoading}
      />
      <Button type="submit" className="w-full mt-4" disabled={isLoading || !text.trim()}>
        {isLoading ? <><LoaderIcon className="animate-spin mr-2" /> Fetching Definitions...</> : 'Save Words & Start'}
      </Button>
    </form>
  );
};

export default WordInputForm;
