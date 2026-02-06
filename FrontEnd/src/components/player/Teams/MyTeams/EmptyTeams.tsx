import React from "react";
import { Search } from "lucide-react";

interface EmptyTeamsProps {
    onExplore: () => void;
}

export const EmptyTeams: React.FC<EmptyTeamsProps> = ({ onExplore }) => (
    <div className="flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed border-border rounded-3xl bg-muted/30">
        {/* Subtle Icon */}
        <div className="p-4 bg-background rounded-full shadow-sm mb-4">
            <Search size={28} className="text-muted-foreground" />
        </div>

        {/* Text */}
        <h3 className="text-xl font-semibold text-foreground mb-1">
            No teams yet
        </h3>
        <p className="text-muted-foreground text-sm mb-6 text-center max-w-[250px]">
            Join a team to start tracking your matches and stats.
        </p>

        {/* Action Button */}
        <button
            onClick={onExplore}
            className="bg-foreground text-background hover:opacity-90 px-6 py-2.5 rounded-xl font-medium transition-all text-sm shadow-sm active:scale-95"
        >
            Explore Teams
        </button>
    </div>
);