import React from 'react';
import { AchievementID, Achievement } from '../types';

interface AchievementsProps {
    allAchievements: Record<AchievementID, Achievement>;
    unlockedIds: Set<AchievementID>;
}

const Achievements: React.FC<AchievementsProps> = ({ allAchievements, unlockedIds }) => {
    const achievementList = Object.entries(allAchievements) as [AchievementID, Achievement][];
    
    if (achievementList.length === 0) return null;

    return (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-center mb-4">Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievementList.map(([id, ach]) => {
                    const isUnlocked = unlockedIds.has(id);
                    return (
                        <div key={id} className={`p-4 rounded-lg text-center transition-all ${isUnlocked ? 'bg-yellow-100 dark:bg-yellow-900/50 border-2 border-yellow-400' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
                            <ach.icon className={`w-10 h-10 mx-auto ${isUnlocked ? 'text-yellow-500' : 'text-slate-400 dark:text-slate-500'}`} />
                            <h3 className={`font-semibold mt-2 ${isUnlocked ? 'text-slate-800 dark:text-yellow-200' : 'text-slate-600 dark:text-slate-400'}`}>{ach.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{ach.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Achievements;
