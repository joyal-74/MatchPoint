import type { Player } from "../../pages/manager/ManageMembers";

interface PlayerAvatarProps {
    jerseyNumber: number;
    status: Player["status"];
    size?: "sm" | "md";
}

const statusColorMap = {
    active: "bg-green-500",
    substitute: "bg-yellow-500",
    bench: "bg-red-500",
};

export function PlayerAvatar({ jerseyNumber, status, size = "md" }: PlayerAvatarProps) {
    const dimension = size === "sm" ? "w-10 h-10" : "w-14 h-14";
    const indicator = size === "sm" ? "w-3 h-3" : "w-4 h-4";

    return (
        <div className="relative">
            <div className={`${dimension} bg-neutral-700 rounded-full flex items-center justify-center`}>
                <span className={`font-bold ${size === "sm" ? "text-sm" : "text-lg"}`}>#{jerseyNumber}</span>
            </div>
            <div className={`absolute -bottom-1 -right-1 ${indicator} ${statusColorMap[status]} rounded-full border-2 border-neutral-800`}></div>
        </div>
    );
}
