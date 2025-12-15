import { FaArrowLeft, FaMapMarkerAlt, FaTrophy, FaUsers } from "react-icons/fa";
import type { LiveScoreState, Match, Team } from "../../../features/manager/Matches/matchTypes";

interface MatchHeaderProps {
    match: Match;
    teamA: Team;
    teamB: Team;
    liveScore: LiveScoreState | null;
    connectionStatus: string;
    viewerCount: number;
    onBack: () => void;
}

export const MatchHeader = ({ match, teamA, teamB, liveScore, connectionStatus, viewerCount, onBack }: MatchHeaderProps) => {
    return (
        <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 border-b border-neutral-800 pb-6">

            {/* Connection Bar */}
            <div className={`text-center py-1 text-xs font-medium mb-4 ${connectionStatus === 'connected' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                {connectionStatus === 'connected' ? (
                    <span>🔵 Live • Last update: {new Date().toLocaleTimeString()}</span>
                ) : (
                    <span>🟡 Connecting...</span>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <button
                    onClick={onBack}
                    className="text-neutral-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
                >
                    <FaArrowLeft /> Back to matches
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        {/* Tags */}
                        <div className="flex items-center gap-2 mb-2 text-sm">
                            <span className="flex items-center text-red-400 font-bold bg-red-900/20 px-2 py-0.5 rounded">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                                LIVE
                            </span>
                            <span className="text-neutral-500">•</span>
                            <span className="text-neutral-300">{match.matchType || 'T20 Match'}</span>
                            <span className="text-neutral-500">•</span>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <FaTrophy />
                                <span className="text-neutral-300">{match.tournamentName || 'Tournament'}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            {teamA?.name || 'Team A'} <span className="text-neutral-500 text-2xl">vs</span> {teamB?.name || 'Team B'}
                        </h1>

                        {/* Meta Data */}
                        <div className="flex flex-wrap items-center gap-4 text-neutral-400 text-sm">
                            <div className="flex items-center gap-1">
                                <FaMapMarkerAlt />
                                <span>{match.venue?.split(',')[0] || 'Venue TBD'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FaUsers />
                                <span>{viewerCount.toLocaleString()} watching</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};