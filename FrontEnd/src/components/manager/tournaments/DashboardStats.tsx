import React from 'react';
import { Trophy, Users, Activity, Calendar } from 'lucide-react';

// Define variants to handle color logic cleanly
type StatVariant = 'primary' | 'blue' | 'destructive' | 'purple';

const VARIANT_STYLES = {
    primary: {
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        trendColor: "text-primary/80"
    },
    blue: {
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-600 dark:text-blue-400",
        trendColor: "text-blue-600/80 dark:text-blue-400/80"
    },
    destructive: {
        iconBg: "bg-red-500/10",
        iconColor: "text-red-600 dark:text-red-400",
        trendColor: "text-red-600/80 dark:text-red-400/80"
    },
    purple: {
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-600 dark:text-purple-400",
        trendColor: "text-purple-600/80 dark:text-purple-400/80"
    }
};

interface StatCardProps {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    trend?: string;
    variant?: StatVariant;
}

const StatCard = ({ label, value, icon, trend, variant = 'primary' }: StatCardProps) => {
    const styles = VARIANT_STYLES[variant];

    return (
        <div className="bg-card border border-border rounded-xl p-5 flex items-start justify-between hover:border-primary/50 transition-colors duration-300 shadow-sm">
            <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-foreground">{value}</h3>
                {trend && <p className="text-xs text-muted-foreground mt-2">{trend}</p>}
            </div>
            <div className={`p-3 rounded-lg ${styles.iconBg} ${styles.iconColor}`}>
                {React.cloneElement(icon as React.ReactElement)}
            </div>
        </div>
    );
};

interface DashboardStatsProps {
    myTournamentsCount: number;
    totalExploreCount: number;
}

export default function DashboardStats({ myTournamentsCount, totalExploreCount }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
                label="My Active Tournaments" 
                value={myTournamentsCount} 
                icon={<Trophy />}
                variant="primary" // Automatically matches your active theme (Green/Violet/etc)
                trend="Currently managing"
            />
            <StatCard 
                label="Total Participants" 
                value="--"
                icon={<Users />}
                variant="blue"
                trend="Across all events"
            />
            <StatCard 
                label="Live Matches" 
                value="0" 
                icon={<Activity />}
                variant="destructive" // Semantic red for "Live/Alert" status
                trend="Happening now"
            />
            <StatCard 
                label="Available to Join" 
                value={totalExploreCount} 
                icon={<Calendar />}
                variant="purple"
                trend="Explore new events"
            />
        </div>
    );
}