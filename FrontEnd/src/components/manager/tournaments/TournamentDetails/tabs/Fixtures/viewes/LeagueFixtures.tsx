import MatchCard from "../shared/MatchCard";
import type { RegisteredTeam } from "../../TabContent";
import type { Match } from "../../../../../../../features/manager/managerTypes";


export default function LeagueFixtures({ matches, teams }: { matches: Match[], teams: RegisteredTeam[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match, idx) => (
                <MatchCard key={idx} match={match} teams={teams} />
            ))}
        </div>
    );
}