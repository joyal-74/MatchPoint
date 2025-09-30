export interface TeamLogoProps {
    logo?: string;
    name: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function TeamLogo({ logo, name, size = 'md', className = '' }: TeamLogoProps) {
    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-20 h-20'
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    return (
        <div className={`flex-shrink-0 ${className}`}>
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-neutral-700 flex items-center justify-center border-2 border-neutral-600`}>
                {logo ? (
                    <img 
                        src={logo} 
                        alt={`${name} Logo`} 
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-600 flex items-center justify-center">
                        <svg className={`${iconSizes[size]} text-neutral-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}