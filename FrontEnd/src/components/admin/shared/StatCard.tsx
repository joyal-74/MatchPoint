import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: string;
    trendDirection?: 'up' | 'down' | 'neutral'; 
    subtext?: string;
    className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    trendDirection = 'neutral',
    subtext,
    className = ''
}) => {

    // Helper to determine trend color and icon
    const getTrendDetails = () => {
        switch (trendDirection) {
            case 'up':
                return { color: 'text-green-600', Icon: ArrowUpRight };
            case 'down':
                return { color: 'text-red-600', Icon: ArrowDownRight };
            default:
                return { color: 'text-muted-foreground', Icon: Minus };
        }
    };

    const { color: trendColor, Icon: TrendIcon } = getTrendDetails();

    return (
        <div className={`bg-card text-card-foreground p-5 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>

            {/* Header: Title and Main Icon */}
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {title}
                </h3>
                {icon && (
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {React.cloneElement(icon as React.ReactElement)}
                    </div>
                )}
            </div>

            {/* Main Value */}
            <div className="flex items-baseline gap-1">
                <h2 className="text-2xl font-bold text-foreground">
                    {value}
                </h2>
            </div>

            {/* Footer: Trend or Subtext */}
            {(trend || subtext) && (
                <div className="mt-3 flex items-center text-xs">
                    {trend && (
                        <span className={`flex items-center font-medium ${trendColor} mr-2`}>
                            <TrendIcon className="w-3 h-3 mr-1" />
                            {trend}
                        </span>
                    )}
                    {subtext && (
                        <span className="text-muted-foreground truncate">
                            {subtext}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default StatCard;