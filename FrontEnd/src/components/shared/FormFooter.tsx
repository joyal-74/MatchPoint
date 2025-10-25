import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface FormFooterProps {
    text: string;
    linkText: string;
    linkTo?: string;
    expiresAt?: string;
    onClick?: () => void;
    disabled?: boolean;
}

const FormFooter: React.FC<FormFooterProps> = ({
    text,
    linkText,
    linkTo,
    onClick,
    expiresAt,
    disabled = false
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (disabled) return; // Respect parent's disabled logic
        if (onClick) {
            onClick();
        } else if (linkTo) {
            navigate(linkTo);
        }
    };

    useEffect(() => {
        console.log('Child received new expiresAt:', expiresAt);
    }, [expiresAt]);

    return (
        <p className="text-sm text-center">
            {text}{" "}
            <span
                className={`text-[var(--color-text-accent)] hover:underline cursor-pointer ${disabled ? "opacity-50 pointer-events-none" : ""}`}
                onClick={handleClick}
            >
                {linkText}
            </span>
        </p>
    );
};

export default FormFooter;