import { Pencil, Trash2 } from "lucide-react";
import type { ColorScheme } from "../../teams/TeamCard/teamColors";

interface ActionButtonsProps {
    status: "upcoming" | "ongoing" | "completed";
    colorScheme: ColorScheme;
}

export function ActionButtons({ status, colorScheme }: ActionButtonsProps) {
    const disabled = status === "completed";

    return (
        <div className="flex gap-2 flex-shrink-0" >
            <button
                className={
                    `
          p-1.5 rounded-lg transition-all duration-200
          ${disabled
                        ? "bg-neutral-700/50 text-neutral-500 cursor-not-allowed"
                        : `${colorScheme.buttonBg} ${colorScheme.buttonHoverBg} ${colorScheme.text}`}
        `}
                disabled={disabled}
            >
                <Pencil size={16} />
            </button>
            < button
                className={`
          p-1.5 rounded-lg transition-all duration-200
          ${disabled
                        ? "bg-neutral-700/50 text-neutral-500 cursor-not-allowed"
                        : "bg-white/10 hover:bg-red-500/50 text-white"}
        `}
                disabled={disabled}
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}
