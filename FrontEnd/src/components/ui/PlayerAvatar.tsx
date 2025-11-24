import type { playerStatus } from "../manager/teams/Types";

interface PlayerAvatarProps {
    profileImage: string;
    status: playerStatus
    size?: "sm" | "md";
}

const statusColorMap: Record<string, string> = {
    active: "text-green-500",
    sub: "text-yellow-400",
    bench: "text-gray-400",
    playing: "text-green-400",
    substitute: "text-yellow-400",
};


export function PlayerAvatar({ profileImage, status, size = "md" }: PlayerAvatarProps) {
    const dimension = size === "sm" ? "w-10 h-10" : "w-14 h-14";
    const indicator = size === "sm" ? "w-3 h-3" : "w-4 h-4";

    return (
        <div className="relative">
            <div className={`${dimension} bg-neutral-700 rounded-full flex items-center justify-center`}>
                <img src={profileImage} alt="" className="rounded-full" />
            </div>
            <div className={`absolute -bottom-1 -right-1 ${indicator} ${statusColorMap[status]} rounded-full border-2 border-neutral-800`}></div>
        </div>
    );
}