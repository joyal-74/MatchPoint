import { Pencil, XCircle } from "lucide-react";
import type { ColorScheme } from "../../teams/TeamCard/teamColors";
import type { Status } from "../../../../features/manager/managerTypes";

interface ActionButtonsProps {
    status: Status;
    colorScheme: ColorScheme;
    tournamentId: string;
    openModal: () => void;
    onCancelClick?: (id: string) => void; // renamed for clarity
}

const ActionButtons = ({
    status,
    colorScheme,
    openModal,
    tournamentId,
    onCancelClick,
}: ActionButtonsProps) => {
    const disabled = status === "ended";

    return (
        <div className="flex gap-2 flex-shrink-0">
            <button
                className={`p-1.5 rounded-lg transition-all duration-200 ${disabled
                        ? "bg-neutral-700/50 text-neutral-500 cursor-not-allowed"
                        : `${colorScheme.buttonBg} ${colorScheme.buttonHoverBg} ${colorScheme.text}`
                    }`}
                disabled={disabled}
                onClick={openModal}
            >
                <Pencil size={16} />
            </button>

            <button
                className={`p-1.5 rounded-lg transition-all duration-200 ${disabled
                        ? "bg-neutral-700/50 text-neutral-500 cursor-not-allowed"
                        : "bg-white/10 hover:bg-red-500/50 text-white"
                    }`}
                disabled={disabled || !onCancelClick}
                onClick={() => onCancelClick?.(tournamentId)}
            >
                <XCircle size={16} /> {/* cancel icon instead of Trash2 */}
            </button>
        </div>
    );
};

export default ActionButtons;
