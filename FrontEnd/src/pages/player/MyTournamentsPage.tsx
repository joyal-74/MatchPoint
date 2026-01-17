import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarClock, Trophy } from "lucide-react";

import LoadingOverlay from "../../components/shared/LoadingOverlay";
import PlayerLayout from "../layout/PlayerLayout";

import { usePlayerTournaments } from "../../hooks/player/usePlayerTournaments";
import { EmptyTournaments } from "../../components/player/EmptyTournaments"; 
import { TournamentsGrid } from "../../components/player/TournamentsGrid"; 

export type TournamentListStatus = "upcoming" | "completed";

const MyTournamentsPage: React.FC = () => {
    const { status } = useParams<{ status: TournamentListStatus }>();
    const [currentStatus, setCurrentStatus] = useState<TournamentListStatus>(status || "upcoming");

    const { upcomingTournaments, completedTournaments, loading } = usePlayerTournaments(currentStatus);

    const tournaments = currentStatus === "upcoming" ? upcomingTournaments : completedTournaments;
    const navigate = useNavigate();

    // 4. Handle Tab Switching
    const handleStatusChange = (newStatus: TournamentListStatus) => {
        setCurrentStatus(newStatus);
        navigate(`/player/mytournaments/${newStatus}`);
    };

    return (
        <PlayerLayout>
            <LoadingOverlay show={loading} />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">My Tournaments</h1>
                        <p className="text-muted-foreground">
                            You have <span className="font-semibold text-foreground">{tournaments?.length || 0}</span> {currentStatus} tournament{tournaments?.length !== 1 ? 's' : ''}.
                        </p>
                    </div>

                    <div className="flex p-1 bg-muted rounded-xl border border-border">
                        <button
                            onClick={() => handleStatusChange("upcoming")}
                            className={`
                                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                ${currentStatus === "upcoming"
                                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                }
                            `}
                        >
                            <CalendarClock size={16} className={currentStatus === "upcoming" ? "text-blue-500" : ""} />
                            Upcoming
                        </button>

                        <button
                            onClick={() => handleStatusChange("completed")}
                            className={`
                                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                ${currentStatus === "completed"
                                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                }
                            `}
                        >
                            <Trophy size={16} className={currentStatus === "completed" ? "text-yellow-500" : ""} />
                            History
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {!loading && (!tournaments || tournaments.length === 0) ? (
                        <EmptyTournaments 
                            status={currentStatus} 
                            onExplore={() => navigate('/player/tournaments')} 
                        />
                    ) : (
                        <TournamentsGrid 
                            tournaments={tournaments || []} 
                            status={currentStatus}
                        />
                    )}
                </div>
            </div>
        </PlayerLayout>
    );
};

export default MyTournamentsPage;