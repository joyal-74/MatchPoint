import React from "react";
import { useNavigate } from "react-router-dom";

interface FormFooterProps {
    text: string;
    linkText: string;
    linkTo?: string;
    onClick?: () => void;
}

const FormFooter: React.FC<FormFooterProps> = ({ text, linkText, linkTo, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) onClick();
        else if (linkTo) navigate(linkTo);
    };

    return (
        <p className="text-sm">
            {text}{" "}
            <span
                className="text-[var(--color-text-accent)] hover:underline cursor-pointer"
                onClick={handleClick}
            >
                {linkText}
            </span>
        </p>
    );
};

export default FormFooter;
