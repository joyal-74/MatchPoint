import React, { useState } from "react";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { usePlayerTeams } from "../../hooks/player/usePlayerTeams";
import PlayerLayout from "../layout/PlayerLayout";
import { EmptyTeams } from "../../components/player/Teams/MyTeams/EmptyTeams";
import { useNavigate, useParams } from "react-router-dom";
import { TeamsGrid } from "../../components/player/Teams/MyTeams/TeamsGrid";
import type { playerJoinStatus } from "../../features/player/playerTypes";

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

            <div className="text-white mt-8">
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">My Teams</h2>
                            <p className="text-neutral-400">{teams?.length || 0} {status === "approved" ? "approved" : "pending"} teams </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleJoinStatus("approved")}
                                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 ${status === "approved"
                                    ? "bg-green-500/20 text-green-300 border border-green-500/30 shadow-lg"
                                    : "bg-neutral-700/30 text-neutral-400 border border-neutral-600/30 hover:bg-neutral-700/50 hover:text-neutral-300"}`}
                            >
                                Approved
                            </button>

                            <button
                                onClick={() => handleJoinStatus("pending")}
                                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 ${status === "pending"
                                    ? "bg-green-500/20 text-green-300 border border-green-500/30 shadow-lg"
                                    : "bg-neutral-700/30 text-neutral-400 border border-neutral-600/30 hover:bg-neutral-700/50 hover:text-neutral-300"
                                    }`}
                            >
                                Pending
                            </button>
                        </div>
                    </div>

                    {(teams?.length === 0 || 0) && !loading ? (
                        <EmptyTeams onExplore={() => navigate('/player/teams')} />
                    ) : (
                        <TeamsGrid teams={teams || []} onLeft={() => console.log('left')} />
                    )}
                </section>
            </div>
        </PlayerLayout>
    );
};

export default TeamsListPage;