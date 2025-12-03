import { MatchDetailsCard } from "./MatchDetailsCard";
import { TossSection } from "./TossSection";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { loadMatchDashboard } from "../../../features/manager/Matches/matchThunks";
import type { MatchData, TeamId, TossDecision } from "./matchTypes";
import { TeamDetailsPanel } from "./TeamDetailsPanel";
import Navbar from "../Navbar";
import { useParams } from "react-router-dom";
import LoadingOverlay from "../../shared/LoadingOverlay";

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
            [teamA?.id ?? ""]: teamA,
            [teamB?.id ?? ""]: teamB,
        }),
        [teamA, teamB]
    );



    const [activeTeamId, setActiveTeamId] = useState(teamA?.id ?? "");
    const [tossWinnerId, setTossWinnerId] = useState<TeamId | null>(null);
    const [tossDecision, setTossDecision] = useState<TossDecision>(null);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        if (teamA?.id) {
            setActiveTeamId(teamA.id);
        }
    }, [teamA]);

    useEffect(() => {
        if (match?.tossWinner) {
            setTossWinnerId(match.tossWinner as TeamId);
        }
        if (match?.tossDecision) {
            setTossDecision(match.tossDecision as TossDecision);
        }
    }, [match]);


    const activeTeam = teamMap[activeTeamId];

    const handleTeamSwitch = useCallback((teamId: TeamId) => {
        setActiveTeamId(teamId);
    }, []);



    if (error || !match || !teamA || !teamB || !activeTeam) {
        return <div className="text-red-500 text-center mt-20 text-xl">Failed: {error}</div>;
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
            <Navbar />
            <LoadingOverlay show={loading} />
            <div className="text-white font-inter p-y md:p-8 mx-12 mt-12">

                {/* Header */}
                <header className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-800">
                    <h1 className="text-2xl font-bold text-white">Match Dashboard</h1>
                </header>

                <main className="flex flex-col lg:flex-row gap-8">

                    <div className="lg:w-1/3 xl:w-1/4 p-4 bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700/50">
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
                    </div>

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
                </main>
            </div>
        </>
    );
};

export default MatchDashboard;