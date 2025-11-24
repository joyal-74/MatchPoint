import { type ReactNode } from "react";

interface TertiaryButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export default function TertiaryButton({ children, onClick, className = "", disabled = false, type = "button",}: TertiaryButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                bg-gradient-to-r from-green-600 to-emerald-600 
                hover:from-green-700 hover:to-emerald-700 
                px-6 py-3 rounded-lg font-medium 
                transition-all duration-300 transform 
                hover:scale-105 shadow-lg disabled:opacity-50 
                ${className}
            `}
        >
            {children}
        </button>
    );
}