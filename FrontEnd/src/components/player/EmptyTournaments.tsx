import React from "react";
import { Trophy, CalendarSearch, History, ArrowRight } from "lucide-react";

interface EmptyTournamentsProps {
    status: "upcoming" | "completed";
    onExplore: () => void;
}

export const EmptyTournaments: React.FC<EmptyTournamentsProps> = ({ status, onExplore }) => {
    const content = {
        upcoming: {
            icon: CalendarSearch,
            title: "No Upcoming Tournaments",
            description: "You haven't registered for any tournaments yet. Find a tournament and start competing!",
            buttonText: "Browse Tournaments"
        },
        completed: {
            icon: History, // or Trophy
            title: "No Tournament History",
            description: "You haven't completed any tournaments yet. Your match history will appear here.",
            buttonText: "Find Your First Tournament"
        }
    };

    const current = content[status];
    const Icon = current.icon;

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center border-2 border-dashed border-border/50 rounded-xl bg-muted/20 animate-in fade-in zoom-in-95 duration-500">

            {/* Icon Circle */}
            <div className="bg-background p-4 rounded-full ring-1 ring-border shadow-sm mb-6">
                <Icon size={32} className="text-muted-foreground" />
            </div>

            {/* Text Content */}
            <h3 className="text-xl font-bold text-foreground mb-2">
                {current.title}
            </h3>

            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                {current.description}
            </p>

            {/* Call to Action */}
            <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
                <Trophy size={16} />
                {current.buttonText}
                <ArrowRight size={16} className="opacity-60" />
            </button>
        </div>
    );
};