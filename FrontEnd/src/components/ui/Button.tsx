import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
    const getVariantClasses = (buttonVariant: typeof variant): string => {
        switch (buttonVariant) {
            case 'secondary':
                return 'bg-gray-500 hover:bg-gray-600 text-white';
            case 'danger':
                return 'bg-red-500 hover:bg-red-600 text-white';
            case 'primary':
            default:
                return 'bg-blue-600 hover:bg-blue-700 text-white';
        }
    };

    const baseClasses = 'px-4 py-2 font-semibold rounded-lg shadow-md focus:outline-none transition duration-150 ease-in-out';
    const variantClasses = getVariantClasses(variant);

    return (
        <button
            className={`${baseClasses} ${variantClasses}`}
            onClick={onClick}
            type="button"
        >
            {children}
        </button>
    );
};

export default Button;