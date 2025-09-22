import React from "react";

interface LoadingOverlayProps {
    show: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-background-overlay)]/80 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
    );
};

export default LoadingOverlay;