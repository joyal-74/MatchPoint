import React from "react";

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    message: string;
    subtitle?: string;
    buttonText?: string;
    onAction?: () => void;
    titleSize?: string;
    messageSize?: string;
    subtitleSize?: string;
}

export default function EmptyState({
    icon,
    title,
    message,
    subtitle,
    buttonText,
    onAction,
    titleSize = "text-xl",
    messageSize = "text-md",
    subtitleSize = "text-sm text-muted-foreground"
}: EmptyStateProps) {
    return (
        <div className="bg-card/50 rounded-2xl  border-border p-8 text-center py-12 flex flex-col items-center justify-center transition-colors duration-300">
            {icon && <div className="mb-4">{icon}</div>}

            <h2 className={`${titleSize} font-semibold mb-2 text-foreground`}>
                {title}
            </h2>

            <p className={`${messageSize} text-muted-foreground max-w-sm mx-auto`}>
                {message}
            </p>

            {subtitle && (
                <p className={`${subtitleSize} mt-2 max-w-sm mx-auto`}>
                    {subtitle}
                </p>
            )}

            {buttonText && onAction && (
                <button
                    onClick={onAction}
                    className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors mt-6 font-medium shadow-lg shadow-primary/20 active:scale-95 transform duration-200"
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
}