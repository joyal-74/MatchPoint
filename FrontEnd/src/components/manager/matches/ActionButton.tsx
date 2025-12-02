import { memo } from "react";

export const ActionButton: React.FC<{ icon: React.ReactNode; label: string; color: 'yellow' | 'green' | 'indigo'; onClick: () => void }> = memo(({ icon, label, color, onClick }) => {
    let colorClasses;
    switch (color) {
        case 'yellow':
            colorClasses = 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-700/50';
            break;
        case 'green':
            colorClasses = 'bg-green-600 hover:bg-green-700 shadow-green-700/50';
            break;
        case 'indigo':
            colorClasses = 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-700/50';
            break;
    }

    return (
        <button
            onClick={onClick}
            className={`py-2 px-4 rounded-lg font-semibold text-sm transition duration-200 flex items-center justify-center space-x-2 text-white shadow-lg ${colorClasses}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
});