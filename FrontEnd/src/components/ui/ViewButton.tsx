import React, { type ButtonHTMLAttributes } from "react";
import { Eye } from "lucide-react";

interface ViewButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    title?: string;
    iconSize?: number;
    variant?: 'solid' | 'outline' | 'ghost'; // Added variants for flexibility
}

const ViewButton: React.FC<ViewButtonProps> = ({ 
    text = "View", 
    title, 
    iconSize = 14, 
    className = "", 
    variant = 'solid',
    ...rest 
}) => {
    
    // Define styles based on variant
    const baseStyles = "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer";
    
    const variants = {
        solid: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm hover:shadow",
        outline: "border border-border bg-transparent text-foreground hover:bg-muted hover:text-primary",
        ghost: "bg-transparent text-muted-foreground hover:text-primary hover:bg-primary/10"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            title={title || text}
            {...rest}
        >
            <Eye size={iconSize} />
            {text && <span>{text}</span>}
        </button>
    );
};

export default ViewButton;