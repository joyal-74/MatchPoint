import type { Status } from "../../../../features/manager/managerTypes";
import type { ColorScheme } from "../../teams/TeamCard/teamColors";

interface CardActionButtonProps {
    status: Status
    type: "manage" | "explore";
    colorScheme: ColorScheme;
}

export function CardActionButton({ status, type, colorScheme }: CardActionButtonProps) {
    const isExplore = type === "explore";
    const isDisabled = isExplore && status === "ended";

    return (
        <button
            disabled={isDisabled}
            className={` px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 border
            ${isDisabled
                    ? "bg-neutral-600/30 text-neutral-400 border-neutral-600/30 cursor-not-allowed"
                    : `${colorScheme.buttonBg} ${colorScheme.text} ${colorScheme.buttonBorder} ${colorScheme.buttonHoverBg} ${colorScheme.buttonHoverBorder} hover:scale-105`}
            `}
        >
            {isExplore ? (isDisabled ? "View Details" : "Register") : "View Details"}
        </button>
    );
}
