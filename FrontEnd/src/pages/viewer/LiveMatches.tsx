import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { RiLiveLine } from "react-icons/ri";
import SkeletonCard from "../../components/viewer/SkeletonCard";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchLiveMatches } from "../../features/viewer/viewerThunks";
import type { RootState } from "../../app/rootReducer";
import Navbar from "../../components/viewer/Navbar";
import { useNavigate } from "react-router-dom";

const getTeamShortName = (teamName: string) => {
    return teamName
        .split(" ")           
        .map(word => word[0]) 
        .join("")             
        .toUpperCase();       
};

const getShortVenue = (venue: string) => {
    if (!venue) return "";
    return venue.split(",").slice(0, 2).join(",").trim();
};

const LiveMatches = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
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
            <div className="mt-8">
                {/* Header */}
                <div className="bg-neutral-800 border-b border-neutral-700">
                    <div className="mx-auto px-20 py-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-6 bg-red-500 rounded"></div>
                            <h1 className="text-2xl font-semibold text-white">Live Matches</h1>
                        </div>
                        <p className="text-neutral-400">
                            Real-time cricket matches happening now
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto px-20 py-8">
                    {/* Stats */}
                    <div className="mb-8">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-neutral-300">
                                    {liveMatches.length} matches live
                                </span>
                            </div>
                            <div className="h-4 w-px bg-neutral-700"></div>
                            <div className="text-sm text-neutral-500">
                                Updated just now
                            </div>
                        </div>
                    </div>

                    {/* Matches Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                        ) : liveMatches.length === 0 ? (
                            <div className="col-span-full">
                                <div className="bg-neutral-800 rounded-lg border border-neutral-700 p-12 text-center">
                                    <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <RiLiveLine className="text-2xl text-neutral-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-2">
                                        No matches live
                                    </h3>
                                    <p className="text-neutral-400 max-w-md mx-auto">
                                        There are no matches being played at the moment.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            liveMatches.map((match) => (
                                <div
                                    key={match._id}
                                    className="bg-neutral-800 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-colors"
                                >
                                    {/* Match Status */}
                                    <div className="px-5 pt-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                <span className="text-sm font-medium text-red-400">LIVE</span>
                                            </div>
                                            <span className="text-xs text-neutral-400 bg-neutral-900 px-2 py-1 rounded">
                                                T20
                                            </span>
                                        </div>

                                        {/* Teams */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-900/30 rounded flex items-center justify-center border border-blue-800/30">
                                                        <span className="font-bold text-blue-400">
                                                            {getTeamShortName(match.teamA)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-white">{match.teamA}</h3>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-red-900/30 rounded flex items-center justify-center border border-red-800/30">
                                                        <span className="font-bold text-red-400">
                                                            {getTeamShortName(match.teamB ?? '')}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-white">{match.teamB}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Score */}
                                        <div className="mt-6 mb-4">
                                            <div className="bg-neutral-900/50 rounded p-4 border border-neutral-700">
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-white">
                                                        {match.runs}<span className="text-neutral-500 mx-2">/</span>{match.wickets}
                                                    </div>
                                                    <div className="text-sm text-neutral-400 mt-1">
                                                        Current Score
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Match Info */}
                                        <div className="space-y-3 border-t border-neutral-700 pt-4">
                                            <div className="flex items-center text-sm text-neutral-400">
                                                <FaMapMarkerAlt className="w-4 h-4 mr-2 text-neutral-500" />
                                                {getShortVenue(match.venue)}
                                            </div>
                                            <div className="flex items-center text-sm text-neutral-400">
                                                <FaClock className="w-4 h-4 mr-2 text-neutral-500" />
                                                {match.status}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="mt-6 pb-5">
                                            <button 
                                            onClick={()=> navigate(`/live/${match.matchId}/details`)}
                                            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                                                Watch Live
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Load More */}
                    {!loading && liveMatches.length > 0 && (
                        <div className="mt-10 text-center">
                            <button className="px-6 py-3 border border-neutral-700 rounded-lg text-neutral-300 font-medium hover:border-neutral-600 hover:bg-neutral-800 transition-colors">
                                Load More Matches
                            </button>
                            <p className="text-sm text-neutral-500 mt-3">
                                Showing {liveMatches.length} live matches
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LiveMatches;