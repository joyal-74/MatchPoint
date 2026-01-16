import React, { memo } from "react";

type ActionButtonProps = {
    icon: React.ReactNode;
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
    onClick: () => void;
    disabled?: boolean;
    className?: string; // Added for extra flexibility
};

export const ActionButton: React.FC<ActionButtonProps> = memo(({ 
    icon, 
    label, 
    variant = 'primary', 
    onClick, 
    disabled,
    className = ""
}) => {
    

    const variants = {
        primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20",
        secondary: "bg-secondary text-secondary-foreground border border-border/50 hover:bg-secondary/80",
        outline: "bg-transparent border border-border text-foreground hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        ghost: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium 
                transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none 
                ${variants[variant]} 
                ${className}
            `}
        >
            <span className="shrink-0">{icon}</span>
            <span className="whitespace-nowrap">{label}</span>
        </button>
    );
});