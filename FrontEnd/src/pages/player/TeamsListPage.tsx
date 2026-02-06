import React, { useState } from "react";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { usePlayerTeams } from "../../hooks/player/usePlayerTeams";
import PlayerLayout from "../layout/PlayerLayout";
import { EmptyTeams } from "../../components/player/Teams/MyTeams/EmptyTeams";
import { useNavigate, useParams } from "react-router-dom";
import { TeamsGrid } from "../../components/player/Teams/MyTeams/TeamsGrid";
import type { playerJoinStatus } from "../../features/player/playerTypes";
import { CheckCircle2, Clock } from "lucide-react";

const TeamsListPage: React.FC = () => {
    const { status } = useParams<{ status: playerJoinStatus }>();
    const [currentStatus, setCurrentStatus] = useState<playerJoinStatus>(status || "approved");
    const { approvedTeams, pendingTeams, loading } = usePlayerTeams(currentStatus);

    const teams = currentStatus === "approved" ? approvedTeams : pendingTeams;
    const navigate = useNavigate();

    const handleJoinStatus = (newStatus: playerJoinStatus) => {
        setCurrentStatus(newStatus);
        navigate(`/player/myteams/${newStatus}`);
    };

    return (
        <PlayerLayout>
            {/* 1. Loading state is handled by overlay */}
            <LoadingOverlay show={loading} />

            <div className="mx-auto px-3 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">My Teams</h1>
                        <p className="text-muted-foreground text-lg">
                            {loading ? (
                                "Fetching your teams..."
                            ) : (
                                <>
                                    You are part of <span className="font-semibold text-primary">{teams?.length || 0}</span> {currentStatus} team{teams?.length !== 1 ? 's' : ''}.
                                </>
                            )}
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex p-1.5 bg-muted/50 rounded-2xl border border-border backdrop-blur-sm">
                        <button
                            onClick={() => handleJoinStatus("approved")}
                            className={`
                                flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200
                                ${currentStatus === "approved"
                                    ? "bg-background text-foreground shadow-md ring-1 ring-border"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/30"
                                }
                            `}
                        >
                            <CheckCircle2 size={18} className={currentStatus === "approved" ? "text-green-500" : ""} />
                            Approved
                        </button>

                        <button
                            onClick={() => handleJoinStatus("pending")}
                            className={`
                                flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200
                                ${currentStatus === "pending"
                                    ? "bg-background text-foreground shadow-md ring-1 ring-border"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/30"
                                }
                            `}
                        >
                            <Clock size={18} className={currentStatus === "pending" ? "text-yellow-500" : ""} />
                            Pending
                        </button>
                    </div>
                </div>

                {/* Content Area - Key forces re-animation on tab change */}
                <div key={currentStatus} className="min-h-[400px] animate-in fade-in slide-in-from-right-4 duration-300">
                    {!loading && (!teams || teams.length === 0) ? (
                        <div className="mt-12">
                            <EmptyTeams onExplore={() => navigate('/player/teams')} />
                        </div>
                    ) : (
                        <TeamsGrid teams={teams || []} />
                    )}
                </div>
            </div>
        </PlayerLayout>
    );
};

export default TeamsListPage;