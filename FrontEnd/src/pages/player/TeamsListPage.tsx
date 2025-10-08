import React from "react";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { usePlayerTeams } from "../../hooks/player/usePlayerTeams";
import PlayerLayout from "../layout/PlayerLayout";
import { EmptyTeams } from "../../components/player/Teams/MyTeams/EmptyTeams";
import { useNavigate } from "react-router-dom";
import { TeamsGrid } from "../../components/player/Teams/MyTeams/TeamsGrid";

const TeamsListPage: React.FC = () => {
    const { teams, loading } = usePlayerTeams();

    const navigate = useNavigate();

    return (
        <PlayerLayout>
            <LoadingOverlay show={loading} />

            <div className="text-white mt-8">

                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">My Teams</h2>
                            <p className="text-neutral-400">{teams.length} teams created</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 bg-green-500/20 text-green-300 border border-green-500/30 shadow-lg"
                            >
                                Approved
                            </button>

                            <button
                                className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2 bg-neutral-700/30 text-neutral-400 border border-neutral-600/30 hover:bg-neutral-700/50 hover:text-neutral-300"
                            >
                                Pending
                            </button>
                        </div>

                    </div>

                    {teams.length === 0 && !loading ? (
                        <EmptyTeams onExplore={() => navigate('/player/teams')} />
                    ) : (
                        <TeamsGrid teams={Array.isArray(teams) ? teams : []} onLeft={() => console.log('left')} />
                    )}
                </section>

            </div>
        </PlayerLayout>
    );
};

export default TeamsListPage;