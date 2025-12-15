import type React from "react";

export const AdminButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: React.ReactNode, variant?: 'primary' | 'secondary' | 'danger' | 'none' }> = ({ icon, children, variant = 'primary', className, ...props }) => {
    const baseStyle = 'flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-lg';
    let colorStyle = '';

    switch (variant) {
        case 'primary':
            colorStyle = 'bg-emerald-600 hover:bg-emerald-700 text-white';
            break;
        case 'secondary':
            colorStyle = 'bg-neutral-700 hover:bg-neutral-600 text-neutral-200 border border-neutral-600';
            break;
        case 'danger':
            colorStyle = 'bg-red-600 hover:bg-red-700 text-white';
            break;
        case 'none':
            colorStyle = 'bg-none text-white !shadow-none';
            break;
    }

    return (
        <button className={`${baseStyle} ${colorStyle} ${className}`} {...props}>
            {icon}
            <span>{children}</span>
        </button>
    );
};