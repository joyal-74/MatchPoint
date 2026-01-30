import type { Player } from "../../../domain/match/types";

type ValidStatus = Exclude<Player["status"], undefined>;

interface PlayerStatusBadgeProps {
    status: Player["status"];
}

export function PlayerStatusBadge({ status }: PlayerStatusBadgeProps) {
    if (!status) return null;

    const colorClass = status === "playing"
        ? "bg-green-500/20 text-green-400"
        : status === "substitute"
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-red-500/20 text-red-400";

    const statusLabel: Record<ValidStatus, string> = {
        playing: "Playing",
        substitute: "Substitute",
        bench: "Bench",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {statusLabel[status]}
        </span>
    );
}