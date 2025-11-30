export const UserButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { icon: React.ReactNode, variant?: 'primary' | 'secondary' | 'current' }> = ({ icon, children, variant = 'primary', className, ...props }) => {

    const baseStyle = 'flex items-center justify-center space-x-2 w-full px-5 py-2 rounded-xl font-bold tracking-wide transition duration-200 shadow-lg uppercase text-xs';
    let colorStyle = '';

    switch (variant) {
        case 'primary':
            colorStyle = 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/50';
            break;
        case 'secondary':
            colorStyle = 'bg-amber-500 hover:bg-amber-600 text-neutral-900 shadow-amber-500/50';
            break;
        case 'current':
            colorStyle = 'bg-neutral-600 text-neutral-300 cursor-default shadow-none border border-neutral-500';
            break;
    }

    return (
        <button className={`${baseStyle} ${colorStyle} ${className}`} {...props}>
            {icon}
            <span>{children}</span>
        </button>
    );
};