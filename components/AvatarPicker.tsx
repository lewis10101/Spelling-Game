import React from 'react';

const AVATARS = ['🧑‍🎓', '👩‍🚀', '🕵️‍♀️', '🧑‍🎨', '🥷', '🧙‍♂️', '🦸‍♀️', '🤖'];

interface AvatarPickerProps {
    currentAvatar: string;
    onSelectAvatar: (avatar: string) => void;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({ currentAvatar, onSelectAvatar }) => {
    return (
        <div id="avatar-section" className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-center mb-4">Choose Your Avatar</h2>
            <div className="flex justify-center flex-wrap gap-3">
                {AVATARS.map(avatar => (
                    <button
                        key={avatar}
                        onClick={() => onSelectAvatar(avatar)}
                        className={`text-3xl p-2 rounded-full transition-transform hover:scale-110 ${currentAvatar === avatar ? 'bg-blue-200 dark:bg-blue-800 ring-2 ring-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        {avatar}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AvatarPicker;
