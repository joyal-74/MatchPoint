import type { Player } from "../../../pages/manager/ManageMembers";

interface PlayerStatusBadgeProps {
    status: Player["status"];
}

export function PlayerStatusBadge({ status }: PlayerStatusBadgeProps) {
    const colorClass = status === "active"
        ? "bg-green-500/20 text-green-400"
        : status === "substitute"
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-red-500/20 text-red-400";

    const statusText = {
        active: "Playing",
        substitute: "Substitute",
        bench: "Bench",
    }[status];

    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>{statusText}</span>;
}
