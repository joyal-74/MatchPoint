import React from "react";
import { TournamentCard } from "./TournamentCard";
import type { Tournament } from "../../features/player/Tournnaments/tournamentType";



interface TournamentsGridProps {
    tournaments: Tournament[];
    status: "upcoming" | "completed";
}

export const TournamentsGrid: React.FC<TournamentsGridProps> = ({
    tournaments,
    status
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament, index) => (
                <div
                    key={tournament._id}
                    className="animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <TournamentCard
                        tournament={tournament}
                        isHistory={status === "completed"}
                    />
                </div>
            ))}
        </div>
    );
};