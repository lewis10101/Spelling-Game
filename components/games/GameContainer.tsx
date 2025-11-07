
import React from 'react';
import { Button } from '../ui/Button';
import { ArrowLeftIcon } from '../icons';

interface GameContainerProps {
  title: string;
  onReturnToMenu: () => void;
  children: React.ReactNode;
}

const GameContainer: React.FC<GameContainerProps> = ({ title, onReturnToMenu, children }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">{title}</h3>
        <Button onClick={onReturnToMenu} variant="secondary" className="text-sm py-1 px-2">
            <ArrowLeftIcon className="w-4 h-4 mr-1"/>
            Menu
        </Button>
      </div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};

export default GameContainer;
