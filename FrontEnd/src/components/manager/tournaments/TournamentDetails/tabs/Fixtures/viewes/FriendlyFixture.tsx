import type { Match } from "../../../../../../../features/manager/managerTypes";
import type { RegisteredTeam } from "../../TabContent";
import MatchCard from "../shared/MatchCard";


export default function FriendlyFixture({ matches, teams }: { matches: Match[], teams: RegisteredTeam[] }) {
    return (
        <div className="flex justify-center">
            <MatchCard match={matches[0]} teams={teams} />
        </div>
    );
}
