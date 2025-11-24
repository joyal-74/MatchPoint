import { UsersRound } from "lucide-react";
import EmptyState from "../shared/EmptyState";

export default function GroupsTab() {
    return (
        <EmptyState
            icon={<UsersRound size={48} className="mx-auto mb-4 text-purple-400" />}
            title="Tournament Groups"
            message="Groups will be formed after registration"
            subtitle="Groups will be announced soon"
        />
    );
}