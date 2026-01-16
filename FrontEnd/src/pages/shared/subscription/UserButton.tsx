import React from 'react';

export const UserButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { 
    icon?: React.ReactNode, 
    variant?: 'primary' | 'secondary' | 'tertiary' | 'current' | 'outline' | 'ghost' 
}> = ({ icon, children, variant = 'primary', className, ...props }) => {

    const baseStyle = 'flex items-center justify-center space-x-2 w-full px-5 py-2.5 rounded-xl font-bold tracking-wide transition-all duration-200 text-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
    
    let variantStyles = '';

    switch (variant) {
        case 'primary':
            // High emphasis action (Upgrade/Subscribe)
            variantStyles = 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40';
            break;
        case 'secondary':
            // Standard action
            variantStyles = 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50 shadow-sm';
            break;
        case 'tertiary':
            // Disabled / Unavailable state
            variantStyles = 'bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted opacity-70 shadow-none';
            break;
        case 'current':
            // Indicator for active plan
            variantStyles = 'bg-muted/50 text-foreground border border-border cursor-default hover:bg-muted/50 shadow-none active:scale-100';
            break;
        case 'outline':
            variantStyles = 'border-2 border-primary text-primary hover:bg-primary/10 bg-transparent shadow-none';
            break;
        case 'ghost':
            variantStyles = 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 shadow-none';
            break;
        default:
            variantStyles = 'bg-primary text-primary-foreground hover:bg-primary/90';
    }

    return (
        <button className={`${baseStyle} ${variantStyles} ${className}`} {...props}>
            {icon && <span className="shrink-0">{icon}</span>}
            <span>{children}</span>
        </button>
    );
};