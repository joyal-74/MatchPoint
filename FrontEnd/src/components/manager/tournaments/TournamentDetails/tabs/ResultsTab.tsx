import { Trophy as TrophyIcon } from "lucide-react";
import EmptyState from "../shared/EmptyState";

export default function ResultsTab() {
    return (
        <EmptyState
            icon={<TrophyIcon size={48} className="mx-auto mb-4 text-amber-400" />}
            title="Match Results"
            message="Results will be posted after matches"
            subtitle="Check back during the tournament"
        />
    );
}