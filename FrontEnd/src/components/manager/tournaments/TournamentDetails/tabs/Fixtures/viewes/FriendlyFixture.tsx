import type { Match } from "../../../../../../../features/manager/managerTypes";
import MatchCard from "../shared/MatchCard";


export default function FriendlyFixture({ matches }: { matches: Match[] }) {
    return (
        <div className="flex justify-center">
            <MatchCard match={matches[0]} />
        </div>
    );
}