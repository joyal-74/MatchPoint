import React, { type ButtonHTMLAttributes } from "react";
import { Eye } from "lucide-react";

interface ViewButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    title?: string;
    iconSize?: number;
}

const ViewButton: React.FC<ViewButtonProps> = ({
    text = "View",
    title,
    iconSize = 12,
    className = "",
    ...rest
}) => {
    return (
        <button
            className={`px-3 py-1 bg-[var(--color-info)] hover:bg-[var(--info-700)] text-[var(--color-text-inverse)] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 hover:shadow-md ${className}`}
            title={title || text}
            {...rest}
        >
            <Eye size={iconSize} />
            {text}
        </button>
    );
};

export default ViewButton;