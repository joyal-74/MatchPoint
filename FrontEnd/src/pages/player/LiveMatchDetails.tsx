import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText, BarChart2 } from "lucide-react"; 

import { useLiveMatchViewer } from "../../hooks/viewer/useLiveMatchWebSocket"; 
import Navbar from "../../components/player/Navbar";
import { MatchHeader } from "../../components/player/tournament/match/MatchHeader"; 
import { ScorecardTab } from "../../components/player/tournament/match/ScorecardTab"; 
import { CommentaryTab } from "../../components/player/tournament/match/CommentaryTab";
import { useAppSelector } from "../../hooks/hooks"; 
import LiveStatusBanner from "../../components/player/tournament/match/LiveStatusBanner";
import LoadingOverlay from "../../components/shared/LoadingOverlay";

const LiveMatchDetails = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const navigate = useNavigate();
    const { match, teamA, teamB, loading, error, liveScore } = useAppSelector((state) => state.match);

    const {
        connectionStatus,
        viewerCount,
        commentary,
        isStreamOnline
    } = useLiveMatchViewer(matchId);

    const [activeTab, setActiveTab] = useState("scorecard");

    // --- Helper Functions (Passed down as props) ---
    const getPlayerName = (playerId: string): string => {
        if (teamA) {
            const member = teamA.members.find((m) => m.userId === playerId);
            if (member) return member.name;
        }
        if (teamB) {
            const member = teamB.members.find((m) => m.userId === playerId);
            if (member) return member.name;
        }
        return `Player ${playerId?.slice(-4) || '???'}`;
    };

    const getPlayerRole = (playerId: string): string => {
        if (teamA) {
            const memberInTeamA = teamA.members.find((member) => member.userId === playerId);
            if (memberInTeamA) return memberInTeamA.role;
        }

        if (teamB) {
            const memberInTeamB = teamB.members.find((member) => member.userId === playerId);
            if (memberInTeamB) return memberInTeamB.role;
        }

        return "Player";
    };

    // --- Loading / Error States ---
    if (loading || !match || !teamA || !teamB) {
        return <LoadingOverlay show={true} />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-destructive">
                Error loading match details. Please try again.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            
            <div className="flex-1">
                
                <MatchHeader
                    match={match}
                    teamA={teamA}
                    teamB={teamB}
                    isStreamOnline={isStreamOnline}
                    connectionStatus={connectionStatus}
                    viewerCount={viewerCount}
                    onBack={() => navigate(-1)}
                />

                <LiveStatusBanner
                    match={match}
                    teamA={teamA}
                    teamB={teamB}
                    liveScore={liveScore}
                    getPlayerName={getPlayerName}
                />

                {/* 3. Main Content Area */}
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Tabs Navigation */}
                    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl mb-8 w-full md:w-fit overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('scorecard')}
                            className={`
                                flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                                ${activeTab === 'scorecard' 
                                    ? 'bg-background text-foreground shadow-sm ring-1 ring-border' 
                                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                }
                            `}
                        >
                            <BarChart2 size={16} />
                            Scorecard
                        </button>
                        <button
                            onClick={() => setActiveTab('commentary')}
                            className={`
                                flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                                ${activeTab === 'commentary' 
                                    ? 'bg-background text-foreground shadow-sm ring-1 ring-border' 
                                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                }
                            `}
                        >
                            <FileText size={16} />
                            Commentary
                            <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                {commentary.length}
                            </span>
                        </button>
                    </div>

                    {/* Tab Content Rendering */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            </div>
        </div>
    );
};

export default LiveMatchDetails;