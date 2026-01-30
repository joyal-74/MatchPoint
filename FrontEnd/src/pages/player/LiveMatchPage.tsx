import { useEffect, useState } from "react";
import { Activity, Wifi, RefreshCw } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import type { RootState } from "../../app/rootReducer";
import Navbar from "../../components/player/Navbar";
import SkeletonCard from "../../components/viewer/SkeletonCard";
import { fetchLiveMatches } from "../../features/player/Tournnaments/tournamentThunks";
import LiveMatchCard from "../../components/player/tournament/LiveMatchCard";

const LiveMatchesPage = () => {
    const dispatch = useAppDispatch();
    const { liveMatches, loading } = useAppSelector((state: RootState) => state.playerTournaments);
    const viewerId = useAppSelector((state: RootState) => state.auth.user?._id);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (viewerId) {
            dispatch(fetchLiveMatches({ status: 'ongoing' }));
        }
    }, [dispatch, viewerId]);

    const handleRefresh = () => {
        if (viewerId) {
            setIsRefreshing(true);
            dispatch(fetchLiveMatches({ status: 'ongoing' })).finally(() => {
                setTimeout(() => setIsRefreshing(false), 500);
            });
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">

                <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mx-auto">

                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                    <Activity className="text-red-500 animate-pulse" />
                                    Live Center
                                </h1>
                                <p className="text-muted-foreground text-sm mt-1">
                                    Real-time scores and streams from ongoing matches.
                                </p>
                            </div>

                            <button
                                onClick={handleRefresh}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:bg-muted text-sm font-medium transition-colors shadow-sm self-start sm:self-auto"
                            >
                                <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                                Refresh Board
                            </button>
                        </div>

                        {/* Grid - Adjusted for better sizing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                            ) : liveMatches.length === 0 ? (
                                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center bg-muted/10 rounded-2xl border border-dashed border-border">
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                                        <Wifi className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground">No matches live right now</h3>
                                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                                        Upcoming matches will appear here automatically when the first ball is bowled.
                                    </p>
                                </div>
                            ) : (
                                liveMatches.map((match) => (
                                    <LiveMatchCard key={match._id} match={match} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LiveMatchesPage;