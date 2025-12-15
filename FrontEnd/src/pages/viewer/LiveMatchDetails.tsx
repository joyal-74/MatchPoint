import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaClock,
    FaMapMarkerAlt,
    FaUsers,
    FaTrophy,
    FaFire,
    FaChartLine,
    FaArrowLeft,
    FaBaseballBall,
    FaUserFriends
} from "react-icons/fa";
import { RiLiveLine } from "react-icons/ri";
import { IoStatsChart } from "react-icons/io5";
import Navbar from "../../components/viewer/Navbar";
import { useLiveMatchViewer } from "../../hooks/viewer/useLiveMatchWebSocket";

interface BattingStat {
    playerId: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: string;
    out: boolean;
    fielderId: string | null;
    isRetiredHurt: boolean;
}

interface BowlingStat {
    playerId: string;
    runsConceded: number;
    wickets: number;
    balls: number;
    overs: number;
    economy: string;
}

interface Extras {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    penalty: number;
}

interface Innings {
    battingTeamId: string;
    bowlingTeamId: string;
    runs: number;
    wickets: number;
    balls: number;
    overs: number;
    currentRunRate: string;
    isCompleted: boolean;
    currentStriker: string | null;
    currentNonStriker: string | null;
    currentBowler: string | null;
    battingStats: BattingStat[];
    bowlingStats: BowlingStat[];
    extras: Extras;
    recentLogs: any[];
}

interface TeamMember {
    _id: string;
    userId: string;
    name: string;
    profileImage: string;
    battingStyle: string;
    bowlingStyle: string;
    role: string;
    stats: any;
    status: string;
}



interface CommentaryItem {
    ball: string;
    text: string;
    type: string;
    isHighlight?: boolean;
}

const LiveMatchPage = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const navigate = useNavigate();

    const {
        match,
        teamA,
        teamB,
        loading,
        error,
        connectionStatus,
        lastUpdate,
        viewerCount,
        commentary,
        reload
    } = useLiveMatchViewer(matchId);

    const [activeTab, setActiveTab] = useState("scorecard");
    const [teamTab, setTeamTab] = useState("teamA");
    const [sectionTab, setSectionTab] = useState("batting");

    // Get current innings safely
    const getCurrentInnings = (): Innings => {
        if (teamTab === "teamA") {
            return match?.innings1 || getDefaultInnings();
        }
        return match?.innings2 || getDefaultInnings();
    };

    const getDefaultInnings = (): Innings => ({
        battingTeamId: "",
        bowlingTeamId: "",
        runs: 0,
        wickets: 0,
        balls: 0,
        overs: 0,
        currentRunRate: "0.00",
        isCompleted: false,
        currentStriker: null,
        currentNonStriker: null,
        currentBowler: null,
        battingStats: [],
        bowlingStats: [],
        extras: {
            wides: 0,
            noBalls: 0,
            byes: 0,
            legByes: 0,
            penalty: 0
        },
        recentLogs: []
    });

    const currentInnings = getCurrentInnings();
    const bowlers = currentInnings.bowlingStats || [];

    if (loading && !match) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-neutral-900 mt-8 flex items-center justify-center">
                    <div className="text-white text-xl">Loading live match data...</div>
                </div>
            </>
        );
    }

    if (error || !match) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-neutral-900 mt-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-400 text-xl mb-4">Failed to load match</div>
                        <button
                            onClick={reload}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // Helper functions
    const calculateRequiredRunRate = (): string => {
        if (!match.innings1 || !match.innings2 || match.innings2.balls === 0) return "0.00";

        const target = match.innings1.runs + 1;
        const ballsRemaining = (match.oversLimit || 20) * 6 - match.innings2.balls;
        const oversRemaining = ballsRemaining / 6;

        if (ballsRemaining <= 0 || oversRemaining <= 0) return "0.00";
        return ((target - match.innings2.runs) / oversRemaining);
    };

    const formatBallsToOvers = (balls: number): string => {
        if (!balls) return "0";
        const overs = Math.floor(balls / 6);
        const remainingBalls = balls % 6;
        return remainingBalls > 0 ? `${overs}.${remainingBalls}` : `${overs}`;
    };

    const getCurrentBatsmen = (): BattingStat[] => {
        if (match.currentInnings === 1) {
            return match.innings1?.battingStats?.filter((b: BattingStat) => !b.out) || [];
        } else {
            return match.innings2?.battingStats?.filter((b: BattingStat) => !b.out) || [];
        }
    };

    const getCurrentBowler = (): BowlingStat | undefined => {
        const currentBowlerId = match.currentInnings === 1
            ? match.innings1?.currentBowler
            : match.innings2?.currentBowler;

        if (!currentBowlerId) return undefined;

        if (match.currentInnings === 1) {
            return match.innings1?.bowlingStats?.find((b: BowlingStat) => b.playerId === currentBowlerId);
        } else {
            return match.innings2?.bowlingStats?.find((b: BowlingStat) => b.playerId === currentBowlerId);
        }
    };

    // Get total extras
    const getTotalExtras = (extras: Extras): number => {
        if (!extras) return 0;
        return extras.wides + extras.noBalls + extras.byes + extras.legByes + extras.penalty;
    };

    // Get player name by ID
    const getPlayerName = (playerId: string): string => {
        // First check teamA members
        if (teamA) {
            const memberInTeamA = teamA.members.find((member: TeamMember) => member.userId === playerId);
            if (memberInTeamA) return memberInTeamA.name;
        }

        // Then check teamB members
        if (teamB) {
            const memberInTeamB = teamB.members.find((member: TeamMember) => member.userId === playerId);
            if (memberInTeamB) return memberInTeamB.name;
        }

        // Fallback to showing player ID
        return `Player ${playerId.slice(-4)}`;
    };

    // Get player role by ID
    const getPlayerRole = (playerId: string): string => {
        if (teamA) {
            const memberInTeamA = teamA.members.find((member: TeamMember) => member.userId === playerId);
            if (memberInTeamA) return memberInTeamA.role;
        }

        if (teamB) {
            const memberInTeamB = teamB.members.find((member: TeamMember) => member.userId === playerId);
            if (memberInTeamB) return memberInTeamB.role;
        }

        return "Player";
    };

    const currentBatsmen = getCurrentBatsmen();
    const currentBowler = getCurrentBowler();

    // Determine which team is batting/bowling
    const battingTeam = match.currentInnings === 1 ? teamA : teamB;
    const bowlingTeam = match.currentInnings === 1 ? teamB : teamA;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-neutral-900 mt-8">
                {/* Connection Status Bar */}
                <div className={`text-center py-1 text-sm ${connectionStatus === 'connected' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                    {connectionStatus === 'connected' ? (
                        <span>🔵 Live updates connected • Last update: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'N/A'} • {viewerCount} viewers</span>
                    ) : connectionStatus === 'connecting' ? (
                        <span>🟡 Connecting to live updates...</span>
                    ) : (
                        <span>🟡 Using fallback updates • Reconnecting...</span>
                    )}
                </div>

                {/* Match Header */}
                <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 border-b border-neutral-800">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-neutral-400 hover:text-white mb-4 flex items-center gap-2"
                        >
                            <FaArrowLeft />
                            Back to matches
                        </button>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="font-medium text-red-400">LIVE</span>
                                    <span className="text-neutral-500 mx-2">•</span>
                                    <span className="text-neutral-300">{match.matchType || 'Match'}</span>
                                    <span className="text-neutral-500 mx-2">•</span>
                                    <div className="flex items-center gap-1">
                                        <FaTrophy className="text-yellow-500" />
                                        <span className="text-neutral-300">{match.tournamentName || 'Tournament'}</span>
                                    </div>
                                </div>

                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    {teamA?.name || 'Team A'} vs {teamB?.name || 'Team B'}
                                </h1>

                                <div className="flex flex-wrap items-center gap-4 text-neutral-400">
                                    <div className="flex items-center gap-1">
                                        <FaMapMarkerAlt />
                                        <span>{match.venue?.split(',')[0] || 'Venue TBD'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FaClock />
                                        <span>{match.status || 'Match in progress'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FaUsers />
                                        <span>{viewerCount.toLocaleString()} viewers</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 rounded-lg transition-colors flex items-center">
                                    <IoStatsChart className="mr-2" />
                                    Advanced Stats
                                </button>
                                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center">
                                    <RiLiveLine className="mr-2" />
                                    Watch Live
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Match Status */}
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 mb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Team A Score */}
                            <div className="text-center space-y-4">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-800/50">
                                        <span className="text-xl font-bold text-blue-400">
                                            {teamA?.shortName || teamA?.name?.split(' ').map((word: string) => word[0]).join('') || 'T1'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{teamA?.name || 'Team A'}</h3>
                                        <div className="text-3xl font-bold text-white mt-1">
                                            {match.innings1?.runs || 0}/{match.innings1?.wickets || 0}
                                        </div>
                                        <div className="text-neutral-400">
                                            ({formatBallsToOvers(match.innings1?.balls || 0)} ov)
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-neutral-300">
                                    <div className="flex justify-between">
                                        <span>Run Rate:</span>
                                        <span className="font-medium">{match.innings1?.currentRunRate || "0.00"}</span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                        <span>Extras:</span>
                                        <span className="font-medium">{getTotalExtras(match.innings1?.extras)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Match Status Center */}
                            <div className="text-center space-y-6 border-x border-neutral-700 px-8">
                                {match.currentInnings === 2 && match.innings1 ? (
                                    <>
                                        <div>
                                            <div className="text-2xl font-bold text-white mb-2">
                                                {battingTeam?.name || 'Batting team'} need {match.innings1.runs + 1 - (match.innings2?.runs || 0)} runs
                                            </div>
                                            <div className="text-neutral-400">
                                                to win from {formatBallsToOvers((match.oversLimit || 20) * 6 - (match.innings2?.balls || 0))} overs
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="text-center">
                                                <div className="text-sm text-neutral-400 mb-1">Current RR</div>
                                                <div className="text-2xl font-bold text-green-400">
                                                    {match.innings2?.currentRunRate || "0.00"}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm text-neutral-400 mb-1">Required RR</div>
                                                <div className="text-2xl font-bold text-red-400">
                                                    {calculateRequiredRunRate()}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <div className="text-2xl font-bold text-white mb-2">
                                                {battingTeam?.name || 'Team A'} batting
                                            </div>
                                            <div className="text-neutral-400">
                                                {formatBallsToOvers((match.oversLimit || 20) * 6 - (match.innings1?.balls || 0))} overs remaining
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="text-center">
                                                <div className="text-sm text-neutral-400 mb-1">Current Run Rate</div>
                                                <div className="text-2xl font-bold text-green-400">
                                                    {match.innings1?.currentRunRate || "0.00"}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-neutral-300">
                                        <FaFire className="text-orange-400" />
                                        <span className="text-sm">Partnership: Calculating...</span>
                                    </div>
                                    <div className="text-sm text-neutral-400">
                                        Last 5 overs: Calculating...
                                    </div>
                                </div>
                            </div>

                            {/* Team B Score */}
                            <div className="text-center space-y-4">
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center border border-red-800/50">
                                        <span className="text-xl font-bold text-red-400">
                                            {teamB?.shortName || teamB?.name?.split(' ').map((word: string) => word[0]).join('') || 'T2'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{teamB?.name || 'Team B'}</h3>
                                        <div className="text-3xl font-bold text-white mt-1">
                                            {match.innings2?.runs || 0}/{match.innings2?.wickets || 0}
                                        </div>
                                        <div className="text-neutral-400">
                                            ({formatBallsToOvers(match.innings2?.balls || 0)} ov)
                                        </div>
                                    </div>
                                </div>

                                {/* Current Batsmen */}
                                {match.currentInnings === 1 && currentBatsmen.length > 0 && (
                                    <div className="space-y-2">
                                        {currentBatsmen.slice(0, 2).map((batsman: BattingStat, index: number) => (
                                            <div key={index} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="text-white font-medium">{getPlayerName(batsman.playerId)}</span>
                                                </div>
                                                <span className="text-neutral-300">{batsman.runs} ({batsman.balls})</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {match.currentInnings === 2 && match.innings2?.battingStats?.length > 0 && (
                                    <div className="space-y-2">
                                        {match.innings2.battingStats.filter(b => !b.out).slice(0, 2).map((batsman: BattingStat, index: number) => (
                                            <div key={index} className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="text-white font-medium">{getPlayerName(batsman.playerId)}</span>
                                                </div>
                                                <span className="text-neutral-300">{batsman.runs} ({batsman.balls})</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Current Bowler */}
                                <div className="text-sm text-neutral-300">
                                    <div className="flex items-center justify-center gap-2">
                                        <FaBaseballBall className="text-blue-400" />
                                        <span>{currentBowler ? getPlayerName(currentBowler.playerId) : "TBA"}</span>
                                        <span className="text-neutral-400">-</span>
                                        <span>{currentBowler ? `${currentBowler.overs} - ${currentBowler.wickets}/${currentBowler.runsConceded}` : '0 - 0/0'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Tabs */}
                    <div className="flex border-b border-neutral-700 mb-6">
                        <button
                            className={`px-6 py-3 font-medium ${activeTab === 'scorecard' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-neutral-400 hover:text-neutral-300'}`}
                            onClick={() => setActiveTab('scorecard')}
                        >
                            Scorecard
                        </button>
                        <button
                            className={`px-6 py-3 font-medium ${activeTab === 'commentary' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-neutral-400 hover:text-neutral-300'}`}
                            onClick={() => setActiveTab('commentary')}
                        >
                            Commentary ({commentary?.length || 0})
                        </button>
                        <button
                            className={`px-6 py-3 font-medium ${activeTab === 'stats' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-neutral-400 hover:text-neutral-300'}`}
                            onClick={() => setActiveTab('stats')}
                        >
                            Match Stats
                        </button>
                        <button
                            className={`px-6 py-3 font-medium ${activeTab === 'graph' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-neutral-400 hover:text-neutral-300'}`}
                            onClick={() => setActiveTab('graph')}
                        >
                            Graph
                        </button>
                    </div>

                    {/* Scorecard Content */}
                    {activeTab === 'scorecard' && (
                        <div className="space-y-6">
                            {/* Team Selection Tabs */}
                            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <div className="flex space-x-1 bg-neutral-900 p-1 rounded-lg">
                                        <button
                                            className={`px-4 py-2 rounded-md font-medium ${teamTab === 'teamA' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-300'}`}
                                            onClick={() => setTeamTab('teamA')}
                                        >
                                            {teamA?.name || 'Team A'}
                                        </button>
                                        <button
                                            className={`px-4 py-2 rounded-md font-medium ${teamTab === 'teamB' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-300'}`}
                                            onClick={() => setTeamTab('teamB')}
                                        >
                                            {teamB?.name || 'Team B'}
                                        </button>
                                    </div>

                                    <div className="flex space-x-1 bg-neutral-900 p-1 rounded-lg">
                                        <button
                                            className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 ${sectionTab === 'batting' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-300'}`}
                                            onClick={() => setSectionTab('batting')}
                                        >
                                            <FaUserFriends />
                                            Batting
                                        </button>
                                        <button
                                            className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 ${sectionTab === 'bowling' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-300'}`}
                                            onClick={() => setSectionTab('bowling')}
                                        >
                                            <FaBaseballBall />
                                            Bowling
                                        </button>
                                    </div>
                                </div>

                                {/* Team Stats Summary */}
                                <div className="mb-8">
                                    {teamTab === 'teamA' ? (
                                        <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-700">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-white">{match.innings1?.runs || 0}</div>
                                                    <div className="text-sm text-neutral-400">Total Runs</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-white">{match.innings1?.wickets || 0}</div>
                                                    <div className="text-sm text-neutral-400">Wickets</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-400">{match.innings1?.currentRunRate || "0.00"}</div>
                                                    <div className="text-sm text-neutral-400">Run Rate</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-yellow-400">{getTotalExtras(match.innings1?.extras)}</div>
                                                    <div className="text-sm text-neutral-400">Extras</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-neutral-900/50 rounded-lg p-4 border border-neutral-700">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-white">{match.innings2?.runs || 0}</div>
                                                    <div className="text-sm text-neutral-400">Total Runs</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-white">{match.innings2?.wickets || 0}</div>
                                                    <div className="text-sm text-neutral-400">Wickets</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-400">{match.innings2?.currentRunRate || "0.00"}</div>
                                                    <div className="text-sm text-neutral-400">Run Rate</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-yellow-400">{getTotalExtras(match.innings2?.extras)}</div>
                                                    <div className="text-sm text-neutral-400">Extras</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Batting Section */}
                                {sectionTab === 'batting' && (
                                    <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
                                        <div className="px-6 py-4 bg-neutral-900 border-b border-neutral-700">
                                            <h3 className="font-bold text-lg text-white">
                                                {teamTab === 'teamA' ? teamA?.name : teamB?.name} Batting
                                                <span className="ml-2 text-sm font-normal text-neutral-400">
                                                    ({formatBallsToOvers(teamTab === 'teamA' ? (match.innings1?.balls || 0) : (match.innings2?.balls || 0))} overs)
                                                </span>
                                            </h3>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-neutral-900">
                                                    <tr>
                                                        <th className="text-left p-4 font-medium text-neutral-300">Batter</th>
                                                        <th className="text-right p-4 font-medium text-neutral-300">R</th>
                                                        <th className="text-right p-4 font-medium text-neutral-300">B</th>
                                                        <th className="text-right p-4 font-medium text-neutral-300">4s</th>
                                                        <th className="text-right p-4 font-medium text-neutral-300">6s</th>
                                                        <th className="text-right p-4 font-medium text-neutral-300">SR</th>
                                                        <th className="text-right p-4 font-medium text-neutral-300">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-neutral-700">
                                                    {(
                                                        teamTab === "teamA"
                                                            ? match.innings1?.battingStats
                                                            : match.innings2?.battingStats
                                                    ) ?? []  /* safest */
                                                        .map((batsman: BattingStat, index: number) => (
                                                            <tr key={index} className={batsman.out ? 'text-neutral-300' : teamTab === 'teamA' ? 'bg-blue-900/10' : 'bg-red-900/10'}>
                                                                <td className="p-4">
                                                                    <div className="flex items-center">
                                                                        <div>
                                                                            <span className="font-medium text-white">{getPlayerName(batsman.playerId)}</span>
                                                                            <div className="text-xs text-neutral-500">{getPlayerRole(batsman.playerId)}</div>
                                                                        </div>
                                                                        {!batsman.out && <span className="ml-2 text-green-400 animate-pulse">●</span>}
                                                                    </div>
                                                                </td>

                                                                <td className="text-right p-4 font-medium text-white">{batsman.runs}</td>
                                                                <td className="text-right p-4">{batsman.balls}</td>
                                                                <td className="text-right p-4">{batsman.fours}</td>
                                                                <td className="text-right p-4">{batsman.sixes}</td>

                                                                <td className="text-right p-4 font-medium">
                                                                    {batsman.strikeRate}
                                                                </td>

                                                                <td className="text-right p-4">
                                                                    {batsman.out ? (
                                                                        <span className="text-red-400 text-sm font-medium">Out</span>
                                                                    ) : (
                                                                        <span className="text-green-400 text-sm font-medium">Not Out</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>

                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Bowling Section */}
                                {sectionTab === 'bowling' && (
                                    <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
                                        <div className="px-6 py-4 bg-neutral-900 border-b border-neutral-700">
                                            <h3 className="font-bold text-lg text-white">
                                                {teamTab === 'teamA' ? teamB?.name : teamA?.name} Bowling
                                            </h3>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-neutral-900">
                                                    <tr>
                                                        <th className="text-left p-4 font-medium text-neutral-300">Bowler</th>
                                                        <th className="text-right p-4 font-medium text-neutral-300">O</th>
                                                        <th className="text-right p-4 font-medium text-neutral-300">M</th>
                                                        <th className="text-right p-4 font-medium text-neutral-300">R</th>
                                                        <th className="text-right p-4 font-medium text-neutral-300">W</th>
                                                        <th className="text-right p-4 font-medium text-neutral-300">Econ</th>
                                                        <th className="text-right p-4 font-medium text-neutral-300">0s</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-neutral-700">
                                                    {bowlers.map((bowler: BowlingStat, index: number) => {
                                                        const isCurrentBowler = bowler.playerId === currentInnings.currentBowler;
                                                        const oversFormatted = bowler.overs;

                                                        return (
                                                            <tr key={index} className={isCurrentBowler ? 'bg-yellow-900/20' : 'text-neutral-300'}>
                                                                <td className="p-4">
                                                                    <div className="flex items-center">
                                                                        <div>
                                                                            <span className="font-medium text-white">{getPlayerName(bowler.playerId)}</span>
                                                                            <div className="text-xs text-neutral-500">{getPlayerRole(bowler.playerId)}</div>
                                                                        </div>
                                                                        {isCurrentBowler && (
                                                                            <span className="ml-2 text-yellow-400 animate-pulse">●</span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="text-right p-4">{oversFormatted}</td>
                                                                <td className="text-right p-4">0</td>
                                                                <td className="text-right p-4">{bowler.runsConceded}</td>
                                                                <td className="text-right p-4 font-medium">
                                                                    <span className={`px-2 py-1 rounded-full text-xs ${bowler.wickets > 0 ? 'bg-red-900/30 text-red-400' : 'bg-neutral-700 text-neutral-300'}`}>
                                                                        {bowler.wickets}
                                                                    </span>
                                                                </td>
                                                                <td className="text-right p-4">
                                                                    <span className={parseFloat(bowler.economy) < 6 ? 'text-green-400' : parseFloat(bowler.economy) < 9 ? 'text-yellow-400' : 'text-red-400'}>
                                                                        {bowler.economy}
                                                                    </span>
                                                                </td>
                                                                <td className="text-right p-4">0</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* Extras and Fall of Wickets */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4">
                                        <h4 className="font-bold text-white mb-4">Extras</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {teamTab === 'teamA' ? (
                                                <>
                                                    <div className="flex justify-between text-neutral-300">
                                                        <span>Wides:</span>
                                                        <span className="font-medium">{match.innings1?.extras?.wides || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between text-neutral-300">
                                                        <span>No Balls:</span>
                                                        <span className="font-medium">{match.innings1?.extras?.noBalls || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between text-neutral-300">
                                                        <span>Leg Byes:</span>
                                                        <span className="font-medium">{match.innings1?.extras?.legByes || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between text-neutral-300">
                                                        <span>Byes:</span>
                                                        <span className="font-medium">{match.innings1?.extras?.byes || 0}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex justify-between text-neutral-300">
                                                        <span>Wides:</span>
                                                        <span className="font-medium">{match.innings2?.extras?.wides || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between text-neutral-300">
                                                        <span>No Balls:</span>
                                                        <span className="font-medium">{match.innings2?.extras?.noBalls || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between text-neutral-300">
                                                        <span>Leg Byes:</span>
                                                        <span className="font-medium">{match.innings2?.extras?.legByes || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between text-neutral-300">
                                                        <span>Byes:</span>
                                                        <span className="font-medium">{match.innings2?.extras?.byes || 0}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4">
                                        <h4 className="font-bold text-white mb-4">Fall of Wickets</h4>
                                        <div className="space-y-2">
                                            <div className="text-neutral-400 text-sm italic">
                                                Wicket data will appear here...
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Commentary Tab */}
                    {activeTab === 'commentary' && (
                        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
                            <h3 className="font-bold text-xl text-white mb-6">Live Commentary</h3>
                            <div className="space-y-6">
                                {commentary && commentary.length > 0 ? (
                                    commentary.map((item: CommentaryItem, index: number) => (
                                        <div key={index} className={`border-l-4 ${item.type === 'WICKET' ? 'border-green-500' : 'border-blue-500'} pl-4`}>
                                            <div className="text-sm text-neutral-400">
                                                {item.ball || '0.0'} overs
                                                {item.isHighlight && <span className="ml-2 text-red-400">🔥</span>}
                                            </div>
                                            <p className="mt-1 text-neutral-300">{item.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-neutral-500">
                                        <div>No commentary yet</div>
                                        <div className="text-sm mt-2">Commentary will appear as the match progresses</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Stats Tab */}
                    {activeTab === 'stats' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
                                <h3 className="font-bold text-xl text-white mb-6">Key Statistics</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-neutral-300">
                                        <span>Highest Partnership</span>
                                        <span className="font-medium text-white">Calculating...</span>
                                    </div>
                                    <div className="flex justify-between items-center text-neutral-300">
                                        <span>Most Runs</span>
                                        <span className="font-medium text-white">Calculating...</span>
                                    </div>
                                    <div className="flex justify-between items-center text-neutral-300">
                                        <span>Most Wickets</span>
                                        <span className="font-medium text-white">Calculating...</span>
                                    </div>
                                    <div className="flex justify-between items-center text-neutral-300">
                                        <span>Best Economy</span>
                                        <span className="font-medium text-white">Calculating...</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
                                <h3 className="font-bold text-xl text-white mb-6">Match Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-neutral-300">
                                        <span>Toss</span>
                                        <span className="font-medium text-white">{match.status || 'Not available'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-neutral-300">
                                        <span>Overs per side</span>
                                        <span className="font-medium text-white">{match.oversLimit || 20}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-neutral-300">
                                        <span>Current Innings</span>
                                        <span className="font-medium text-green-400">Innings {match.currentInnings}</span>
                                    </div>
                                    {match.currentInnings === 2 && (
                                        <div className="flex justify-between items-center text-neutral-300">
                                            <span>Required Run Rate</span>
                                            <span className="font-medium text-red-400">{calculateRequiredRunRate()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Graph Tab */}
                    {activeTab === 'graph' && (
                        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
                            <h3 className="font-bold text-xl text-white mb-6">Run Rate Comparison</h3>
                            <div className="h-64 bg-neutral-900 rounded-lg flex items-center justify-center border border-neutral-700">
                                <div className="text-center text-neutral-500">
                                    <FaChartLine className="text-4xl mx-auto mb-2" />
                                    <p>Run rate graph will appear here</p>
                                    <p className="text-sm mt-2">Visual comparison of run rates between innings</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LiveMatchPage;