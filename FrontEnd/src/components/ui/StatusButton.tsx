import React, { type ButtonHTMLAttributes } from "react";
import { UserX, UserCheck } from "lucide-react";

interface StatusButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isActive: boolean;
    onBlock?: (e: React.MouseEvent) => void;
    onActivate?: (e: React.MouseEvent) => void;
    size?: number;
    showText?: boolean;
}

const StatusButton: React.FC<StatusButtonProps> = ({
    isActive,
    onBlock,
    onActivate,
    size = 16,
    showText = false,
    className,
    ...rest
}) => {
    // 1. STATE: User is Active -> Show "Block" Action
    if (isActive) {
        return (
            <button
                type="button"
                onClick={onBlock}
                title="Block User"
                className={`
                    group flex items-center justify-center gap-2 px-2.5 py-1 rounded-md text-sm font-medium transition-all duration-200
                    
                    /* Light Mode: Standard Destructive Color */
                    bg-destructive/10 text-destructive border border-destructive/20
                    hover:bg-destructive/20 hover:border-destructive/30
                    
                    /* Dark Mode: Brighter Red for better contrast */
                    dark:text-red-400 dark:border-red-400/20 dark:hover:bg-red-400/10

                    focus:outline-none focus:ring-2 focus:ring-destructive/20
                    ${className || ""}
                `}
                {...rest}
            >
                <UserX size={size} className="shrink-0" />
                {showText && <span>Block</span>}
            </button>
        );
    }

    // 2. STATE: User is Blocked -> Show "Activate" Action
    return (
        <button
            type="button"
            onClick={onActivate}
            title="Activate User"
            className={`
                group flex items-center justify-center gap-2 px-2.5 py-1 rounded-md text-sm font-medium transition-all duration-200
                
                /* Light Mode: Standard Emerald */
                bg-emerald-500/10 text-emerald-600 border border-emerald-500/20
                hover:bg-emerald-500/20 hover:border-emerald-500/30
                
                /* Dark Mode: Brighter Emerald */
                dark:text-emerald-400 dark:border-emerald-400/20 dark:hover:bg-emerald-400/10

                focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                ${className || ""}
            `}
            {...rest}
        >
            <UserCheck size={size} className="shrink-0" />
            {showText && <span>Activate</span>}
        </button>
    );
};

export default StatusButton;