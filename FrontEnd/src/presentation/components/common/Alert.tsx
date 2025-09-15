import React, { useEffect, useState } from "react";

interface AlertProps {
    type?: "success" | "error" | "warning" | "info";
    message: string;
    duration?: number; // auto close time in ms
    onClose: () => void;
    title?: string; // Optional title for the alert
}

const Alert: React.FC<AlertProps> = ({
    type = "info",
    message,
    duration = 3000,
    onClose,
    title,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for animation to complete
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const baseStyles =
        "fixed top-5 right-5 max-w-sm w-full p-4 rounded-xl shadow-2xl text-white transition-all duration-300 ease-in-out transform flex items-start gap-3 z-50";
    const typeStyles: Record<typeof type, string> = {
        success: "bg-green-600 border-green-700",
        error: "bg-red-600 border-red-700",
        warning: "bg-yellow-500 text-gray-900 border-yellow-600",
        info: "bg-blue-600 border-blue-700",
    };

    const iconMap: Record<typeof type, string> = {
        success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
        error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
        warning: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
    };

    return (
        <div
            className={`${baseStyles} ${typeStyles[type]} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                } border-l-4`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <svg
                className="w-6 h-6 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={iconMap[type]}
                />
            </svg>
            <div className="flex-1">
                {title && <h3 className="font-semibold text-lg mb-1">{title}</h3>}
                <p className="text-sm">{message}</p>
            </div>
            <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                aria-label="Close alert"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    );
};

export default Alert;