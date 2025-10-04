import { Swords } from "lucide-react";
import EmptyState from "../shared/EmptyState";

export default function MatchesTab() {
    return (
        <EmptyState
            icon={<Swords size={48} className="mx-auto mb-4 text-green-400" />}
            title="Live & Upcoming Matches"
            message="Matches schedule coming soon"
            subtitle="Matches will appear here once fixtures are generated"
        />
    );
}