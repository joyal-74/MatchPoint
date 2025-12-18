import { useEffect } from "react";
import { RiLiveLine } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchLiveMatches } from "../../features/viewer/viewerThunks";
import type { RootState } from "../../app/rootReducer";
import Navbar from "../../components/viewer/Navbar";
import SkeletonCard from "../../components/viewer/SkeletonCard";
import LiveMatchCard from "../../components/viewer/LiveMatchCard";

const LiveMatches = () => {
    const dispatch = useAppDispatch();
    const { liveMatches, loading } = useAppSelector((state: RootState) => state.viewer);
    const viewerId = useAppSelector((state: RootState) => state.auth.user?._id);

    useEffect(() => {
        if (viewerId) {
            dispatch(fetchLiveMatches(viewerId));
        }
    }, [dispatch, viewerId]);

    return (
        <>
            <Navbar />
            
            <div className="min-h-screen bg-[#0a0a0a]">
                
                {/* Hero Header */}
                <div className="relative bg-neutral-900 border-b border-neutral-800 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neutral-800/30 via-transparent to-transparent opacity-50" />
                    
                    <div className="relative mx-auto px-20 sm:px-6 lg:px-20 py-8 md:py-10 mt-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <span className="flex relative h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                                </span>
                                <span className="text-red-500 font-bold tracking-widest text-xs uppercase">Live Coverage</span>
                            </div>
                            
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                Live Matches
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                    
                    {/* Status Bar */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <span className="text-white font-medium text-lg">
                                {liveMatches.length} <span className="text-neutral-500">Matches On Air</span>
                            </span>
                        </div>
                    </div>

                    {/* Matches Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                        ) : liveMatches.length === 0 ? (
                            <div className="col-span-full py-20">
                                <div className="bg-neutral-900/50 rounded-3xl border border-white/5 p-12 text-center max-w-lg mx-auto backdrop-blur-sm">
                                    <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-white/10">
                                        <RiLiveLine className="text-3xl text-neutral-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        No Live Matches
                                    </h3>
                                    <p className="text-neutral-400 leading-relaxed">
                                        The pitch is quiet for now. Check back later for upcoming fixtures and live tournament coverage.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            liveMatches.map((match) => (
                                <LiveMatchCard key={match._id} match={match} />
                            ))
                        )}
                    </div>

                    {/* Footer / Load More */}
                    {!loading && liveMatches.length > 0 && (
                        <div className="mt-16 text-center">
                            <p className="text-sm text-neutral-600 font-medium uppercase tracking-widest">
                                End of List
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LiveMatches;