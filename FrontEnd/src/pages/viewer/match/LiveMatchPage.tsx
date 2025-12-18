import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useLiveMatchViewer } from "../../../hooks/viewer/useLiveMatchWebSocket";
import Navbar from "../../../components/viewer/Navbar";

import { MatchHeader } from "./MatchHeader";
import { ScorecardTab } from "./ScorecardTab";
import { CommentaryTab } from "./CommentaryTab";
import { useAppSelector } from "../../../hooks/hooks";
import LiveStatusBanner from "./LiveStatusBanner";

const LiveMatchPage = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const navigate = useNavigate();
    const { match, teamA, teamB, loading, error, liveScore } = useAppSelector((state) => state.match);

    const {
        connectionStatus,
        viewerCount,
        commentary,
        isStreamOnline
    } = useLiveMatchViewer(matchId);

    console.log(liveScore)

    const [activeTab, setActiveTab] = useState("scorecard");

    // --- Helper Functions (Passed down as props) ---
    const getPlayerName = (playerId: string): string => {
        if (teamA) {
            const member = teamA.members.find((m) => m._id === playerId);
            if (member) return member.name;
        }
        if (teamB) {
            const member = teamB.members.find((m) => m._id === playerId);
            if (member) return member.name;
        }
        return `Player ${playerId?.slice(-4) || '???'}`;
    };

    const getPlayerRole = (playerId: string): string => {
        if (teamA) {
            const memberInTeamA = teamA.members.find((member) => member._id === playerId);
            if (memberInTeamA) return memberInTeamA.role;
        }

        if (teamB) {
            const memberInTeamB = teamB.members.find((member) => member._id === playerId);
            if (memberInTeamB) return memberInTeamB.role;
        }

        return "Player";
    };

    // --- Loading / Error States ---
    if (loading && !match || !teamA || !teamB) return <div className="text-white p-10 text-center">Loading match...</div>;
    if (error || !match || !teamA) return <div className="text-red-400 p-10 text-center">Error loading match.</div>;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-neutral-900 mt-8">

                {/* 1. Header Section */}
                <MatchHeader
                    match={match}
                    teamA={teamA}
                    teamB={teamB}
                    isStreamOnline={isStreamOnline}
                    connectionStatus={connectionStatus}
                    viewerCount={viewerCount}
                    onBack={() => navigate(-1)}
                />

                {/* 2. Live Status Banner */}
                <LiveStatusBanner
                    match={match}
                    teamA={teamA}
                    teamB={teamB}
                    liveScore={liveScore}
                    getPlayerName={getPlayerName}
                />

                {/* 3. Main Content Area */}
                <div className="mx-auto px-20 py-6">
                    {/* Tabs Navigation */}
                    <div className="flex border-b border-neutral-700 mb-6">
                        {['scorecard', 'commentary'].map((tab) => (
                            <button
                                key={tab}
                                className={`px-6 py-3 font-medium capitalize ${activeTab === tab
                                    ? 'border-b-2 border-blue-500 text-blue-400'
                                    : 'text-neutral-400 hover:text-neutral-300'
                                    }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content Rendering */}
                    {activeTab === 'scorecard' && (
                        <ScorecardTab
                            match={match}
                            teamA={teamA}
                            teamB={teamB}
                            liveScore={liveScore}
                            getPlayerName={getPlayerName}
                            getPlayerRole={getPlayerRole}
                        />
                    )}

                    {activeTab === 'commentary' && (
                        <CommentaryTab commentary={commentary} />
                    )}
                </div>
            </div>
        </>
    );
};

export default LiveMatchPage;