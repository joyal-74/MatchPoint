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
            <LoadingOverlay show={loading} />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">My Teams</h1>
                        <p className="text-muted-foreground">
                            You are currently part of <span className="font-semibold text-foreground">{teams?.length || 0}</span> {currentStatus} team{teams?.length !== 1 ? 's' : ''}.
                        </p>
                    </div>

                    {/* Tab Switcher (Pill Style) */}
                    <div className="flex p-1 bg-muted rounded-xl border border-border">
                        <button
                            onClick={() => handleJoinStatus("approved")}
                            className={`
                                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                ${currentStatus === "approved"
                                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                }
                            `}
                        >
                            <CheckCircle2 size={16} className={currentStatus === "approved" ? "text-green-500" : ""} />
                            Approved
                        </button>

                        <button
                            onClick={() => handleJoinStatus("pending")}
                            className={`
                                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                                ${currentStatus === "pending"
                                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                }
                            `}
                        >
                            <Clock size={16} className={currentStatus === "pending" ? "text-yellow-500" : ""} />
                            Pending
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {!loading && (!teams || teams.length === 0) ? (
                        <EmptyTeams onExplore={() => navigate('/player/teams')} />
                    ) : (
                        <TeamsGrid teams={teams || []} />
                    )}
                </div>
            </div>
        </PlayerLayout>
    );
};

export default TeamsListPage;