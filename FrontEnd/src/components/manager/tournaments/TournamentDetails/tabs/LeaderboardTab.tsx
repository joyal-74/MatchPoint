import { BarChart3 } from "lucide-react";
import EmptyState from "../shared/EmptyState";

export default function LeaderboardTab() {
    return (
        <EmptyState
            icon={<BarChart3 size={48} className="mx-auto mb-4 text-red-400" />}
            title="Tournament Leaderboard"
            message="Leaderboard will update during the tournament"
            subtitle="Standings will appear here once matches start"
        />
    );
}