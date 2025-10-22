import type { Match } from "../../../../../../../features/manager/managerTypes";
import type { RegisteredTeam } from "../../TabContent";
import MatchCard from "../shared/MatchCard";


export default function KnockoutFixtures({ matches, teams }: { matches: Match[], teams: RegisteredTeam[] }) {

    const rounds = Math.max(...matches.map(m => m.round));

    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {[...Array(rounds)].map((_, i) => {
                const roundMatches = matches.filter(m => m.round === i + 1);
                return (
                    <div key={i} className="min-w-[240px]">
                        <h4 className="text-sm font-semibold text-neutral-400 mb-2">Round {i + 1}</h4>
                        <div className="space-y-3">
                            {roundMatches.map((match, idx) => (
                                <MatchCard key={idx} match={match} teams={teams} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
