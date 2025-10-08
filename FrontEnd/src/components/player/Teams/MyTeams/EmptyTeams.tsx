import React from "react";

interface EmptyTeamsProps {
    onExplore: () => void;
}

export const EmptyTeams: React.FC<EmptyTeamsProps> = ({ onExplore }) => (
    <div className="text-center py-12">
        <div className="text-neutral-500 text-lg mb-4">Not joined any teams yet</div>
        <button
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-3 rounded-lg font-medium transition-all duration-300"
            onClick={onExplore}
        >
            Explore Teams
        </button>
    </div>
);