import { type ReactNode } from "react";

interface SecondaryButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export default function SecondaryButton({ children, onClick, className = "", disabled = false, type = "button", }: SecondaryButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`text-green-400 hover:text-green-300 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 border border-green-400/20 hover:border-green-400/40 bg-green-400/5 hover:bg-green-400/10 disabled:opacity-50 ${className}`}
        >
            {children}
        </button>
    );
}
