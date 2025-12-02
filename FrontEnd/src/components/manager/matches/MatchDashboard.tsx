import { MatchDetailsCard } from "./MatchDetailsCard";
import { TossSection } from "./TossSection";
import { useCallback, useMemo, useState } from "react";
import type { TeamId, TossDecision } from "./matchTypes";
import { MOCK_MATCH_DATA } from "./MockData";
import { TeamDetailsPanel } from "./TeamDetailsPanel";
import Navbar from "../Navbar";

export const MatchDashboard: React.FC = () => {
    const { team1, team2 } = MOCK_MATCH_DATA;
    const teamMap = useMemo(() => ({
        [team1.id]: team1,
        [team2.id]: team2,
    }), [team1, team2]);


    const [activeTeamId, setActiveTeamId] = useState<TeamId>(team1.id as TeamId);

    const [tossWinnerId, setTossWinnerId] = useState<TeamId | null>(null);
    const [tossDecision, setTossDecision] = useState<TossDecision>(null);
    const [isFlipping, setIsFlipping] = useState(false);

    const activeTeam = teamMap[activeTeamId];

    const handleTeamSwitch = useCallback((teamId: TeamId) => {
        setActiveTeamId(teamId);
    }, []);

    return (
        <>
            <Navbar />
            <div className=" text-white font-inter p-y md:p-8 mx-12 mt-12">

                {/* Header */}
                <header className="flex justify-between items-center mb-6 pb-4 border-b border-neutral-800">
                    <h1 className="text-2xl font-bold text-white">Match Dashboard</h1>
                </header>

                <main className="flex flex-col lg:flex-row gap-8">

                    <div className="lg:w-1/3 xl:w-1/4 p-4 bg-neutral-800 rounded-xl shadow-2xl border border-neutral-700/50">
                        <TossSection
                            team1={team1}
                            team2={team2}
                            tossWinnerId={tossWinnerId}
                            tossDecision={tossDecision}
                            isFlipping={isFlipping}
                            setTossWinnerId={setTossWinnerId}
                            setTossDecision={setTossDecision}
                            setIsFlipping={setIsFlipping}
                        />
                        <MatchDetailsCard data={MOCK_MATCH_DATA} />
                    </div>

                    <TeamDetailsPanel
                        team={activeTeam}
                        team1={team1}
                        team2={team2}
                        activeTeamId={activeTeamId}
                        handleTeamSwitch={handleTeamSwitch}
                    />
                </main>
            </div>
        </>
    );
};

export default MatchDashboard;