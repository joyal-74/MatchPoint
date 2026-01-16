import { Users } from "lucide-react";

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
        sm: 20,
        md: 28,
        lg: 32
    };

    return (
        <div className={`flex-shrink-0 ${className}`}>
            <div className={`
                ${sizeClasses[size]} 
                rounded-full overflow-hidden 
                bg-muted border-2 border-border 
                flex items-center justify-center 
                shadow-sm
            `}>
                {logo ? (
                    <img 
                        src={logo} 
                        alt={`${name} Logo`} 
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/50">
                        <Users 
                            size={iconSizes[size]} 
                            className="text-muted-foreground/50" 
                            strokeWidth={1.5}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}