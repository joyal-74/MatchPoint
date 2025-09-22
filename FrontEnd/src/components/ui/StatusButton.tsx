import React, { type ButtonHTMLAttributes } from "react";
import { UserX, UserCheck } from "lucide-react";

interface StatusButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isActive: boolean;
    onBlock?: () => void;
    onActivate?: () => void;
    size?: number;
    showText?: boolean;
}

const StatusButton: React.FC<StatusButtonProps> = ({
    isActive,
    onBlock,
    onActivate,
    size = 16,
    showText = false,
    ...rest
}) => {
    return isActive ? (
        <button
            className="flex items-center gap-1 p-1.5 text-[var(--color-error)] hover:text-[var(--error-700)] hover:bg-[var(--color-error-bg)] rounded-lg transition-all duration-200"
            title="Block user"
            onClick={onBlock}
            {...rest}
        >
            <UserX size={size} />
            {showText}
        </button>
    ) : (
        <button
            className="flex items-center gap-1 p-1.5 text-[var(--color-success)] hover:text-[var(--success-700)] hover:bg-[var(--color-success-bg)] rounded-lg transition-all duration-200"
            title="Activate user"
            onClick={onActivate}
            {...rest}
        >
            <UserCheck size={size} />
            {showText}
        </button>
    );
};

export default StatusButton;