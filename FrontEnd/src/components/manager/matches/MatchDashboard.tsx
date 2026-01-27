import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { loadMatchDashboard } from "../../../features/manager/Matches/matchThunks";
import type { MatchData, TeamId, TossDecision } from "./matchTypes";
import { MatchDetailsCard } from "./MatchDetailsCard";
import { TossSection } from "./TossSection";
import { TeamDetailsPanel } from "./TeamDetailsPanel";
import Navbar from "../Navbar";
import LoadingOverlay from "../../shared/LoadingOverlay";
import { Calendar, MapPin, Clock } from "lucide-react";

export const MatchDashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { matchId } = useParams();

    const { match, teamA, teamB, loading, error } = useAppSelector(
        (state) => state.match
    );

    useEffect(() => {
        if (matchId) dispatch(loadMatchDashboard(matchId));
    }, [matchId, dispatch]);

    const teamMap = useMemo(
        () => ({
            [teamA?._id ?? ""]: teamA,
            [teamB?._id ?? ""]: teamB,
        }),
        [teamA, teamB]
    );

    const [activeTeamId, setActiveTeamId] = useState(teamA?._id ?? "");
    const [tossWinnerId, setTossWinnerId] = useState<TeamId | null>(null);
    const [tossDecision, setTossDecision] = useState<TossDecision>(null);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        if (teamA?._id) setActiveTeamId(teamA._id);
    }, [teamA]);

    useEffect(() => {
        if (match?.tossWinner) setTossWinnerId(match.tossWinner as TeamId);
        if (match?.tossDecision) setTossDecision(match.tossDecision as TossDecision);
    }, [match]);

    const activeTeam = teamMap[activeTeamId];

    const handleTeamSwitch = useCallback((teamId: TeamId) => {
        setActiveTeamId(teamId);
    }, []);

    if (error || !match || !teamA || !teamB || !activeTeam) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-destructive text-xl font-medium">Error: {error || "Failed to load match data"}</div>
            </div>
        );
    }

    const matchData: MatchData = {
        matchNo: Number(match.matchNumber),
        team1: teamA,
        team2: teamB,
        venue: match.venue?.substring(0, 20) ?? "",
        date: new Date(match.date).toLocaleDateString(),
        time: new Date(match.date).toLocaleTimeString(),
        overs: match.overs ?? 0
    };

    return (
        <>
            <div className="bg-background text-foreground mt-12">
                <Navbar />
                <LoadingOverlay show={loading} />

                <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
                    {/* Header Section */}
                    <header className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">Match Dashboard</h1>
                                <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
                                    <span className="flex items-center gap-1"><Calendar size={14} /> {matchData.date}</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> {matchData.time}</span>
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {matchData.venue}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                                    Match #{matchData.matchNo}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Grid Layout */}
                    <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* Left Sidebar: Match Info & Toss */}
                        <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
                            <TossSection
                                team1={teamA}
                                team2={teamB}
                                tossWinnerId={tossWinnerId}
                                tossDecision={tossDecision}
                                isFlipping={isFlipping}
                                setTossWinnerId={setTossWinnerId}
                                setTossDecision={setTossDecision}
                                setIsFlipping={setIsFlipping}
                                isTossLocked={!!tossWinnerId && !!tossDecision}
                            />
                            <MatchDetailsCard data={matchData} />
                        </aside>

                        {/* Right Panel: Team Management */}
                        <section className="lg:col-span-8 xl:col-span-9 h-full">
                            <TeamDetailsPanel
                                matchId={matchId!}
                                team={activeTeam!}
                                team1={teamA}
                                team2={teamB}
                                activeTeamId={activeTeamId}
                                handleTeamSwitch={handleTeamSwitch}
                                tossWinnerId={tossWinnerId}
                                tossDecision={tossDecision}
                            />
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
};

export default MatchDashboard;