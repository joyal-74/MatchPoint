export const UserButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: React.ReactNode, variant?: 'primary' | 'secondary' | 'tertiary' | 'current' }> = ({ icon, children, variant = 'primary', className, ...props }) => {

    // Removed the 'uppercase' style to improve readability on action buttons, keeping it bold.
    const baseStyle = 'flex items-center justify-center space-x-2 w-full px-5 py-2 rounded-xl font-bold tracking-wide transition duration-200 shadow-lg text-sm';
    let colorStyle = '';

    switch (variant) {
        case 'primary':
            // NEW: Use Cyan for standard action
            colorStyle = 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-500/50';
            break;
        case 'secondary':
            // NEW: Use Emerald for highest priority action (Super Plan Upgrade)
            colorStyle = 'bg-emerald-500 hover:bg-emerald-600 text-neutral-900 shadow-emerald-500/50';
            break;
        case 'tertiary':
            // NEW: Subdued dark color for "Not Available" / disabled look
            colorStyle = 'bg-neutral-700 hover:bg-neutral-600/80 text-neutral-400 shadow-none cursor-not-allowed';
            break;
        case 'current':
            // NEW: Darker gray for the current plan indicator, no border needed.
            colorStyle = 'bg-neutral-700 text-neutral-300 cursor-default shadow-none';
            break;
    }

    return (
        <button className={`${baseStyle} ${colorStyle} ${className}`} {...props}>
            {icon}
            <span>{children}</span>
        </button>
    );
};