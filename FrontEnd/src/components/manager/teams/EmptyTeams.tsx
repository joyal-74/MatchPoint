import React from "react";
import { Users, Plus } from "lucide-react";

interface EmptyTeamsProps {
    onCreate: () => void;
}

export const EmptyTeams: React.FC<EmptyTeamsProps> = ({ onCreate }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in-95 duration-300">
        
        {/* Icon Bubble */}
        <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6 ring-1 ring-border border border-muted shadow-sm">
            <Users className="w-10 h-10 text-muted-foreground/60" strokeWidth={1.5} />
        </div>

        {/* Text Content */}
        <h3 className="text-xl font-bold text-foreground mb-2">No teams created yet</h3>
        <p className="text-muted-foreground max-w-sm mb-8 text-sm leading-relaxed">
            Get started by creating your first team to participate in tournaments, track stats, and manage your roster.
        </p>

        {/* Action Button */}
        <button
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 hover:-translate-y-0.5"
            onClick={onCreate}
        >
            <Plus size={20} />
            Create Your First Team
        </button>
    </div>
);