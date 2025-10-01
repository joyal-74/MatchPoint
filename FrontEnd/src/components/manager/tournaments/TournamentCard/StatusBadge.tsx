import type { ColorScheme } from "../../teams/TeamCard/teamColors";

interface StatusBadgeProps {
    status: "upcoming" | "ongoing" | "completed";
    colorScheme: ColorScheme;
}

export function StatusBadge({ status, colorScheme }: StatusBadgeProps) {
    return (
        <div
            className={`
        px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-sm border
        ${status === "ongoing"
                    ? `${colorScheme.buttonBg} ${colorScheme.text} ${colorScheme.buttonBorder}`
                    : "bg-neutral-600/20 text-neutral-400 border-neutral-600/30"}
      `}
        >
            {status}
        </div>
    );
}
