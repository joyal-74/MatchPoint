import { Trophy, Users, Calendar } from "lucide-react";

interface ManagerStatsSectionProps {
    stats: {
        tournamentsCreated: number;
        tournamentsParticipated: number;
        totalTeams: number;
    };
}

const ManagerStatsSection = ({ stats }: ManagerStatsSectionProps) => {
    return (
        <div className="space-y-4">           
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard 
                    label="Tournaments Created" 
                    value={stats.tournamentsCreated} 
                    variant="success" 
                    subtitle="Total tournaments organized"
                    icon={<Trophy size={20} />}
                />
                <StatCard 
                    label="Tournaments Participated" 
                    value={stats.tournamentsParticipated} 
                    variant="info" 
                    subtitle="Total tournaments joined"
                    icon={<Calendar size={20} />}
                />
                <StatCard 
                    label="Total Teams" 
                    value={stats.totalTeams} 
                    variant="primary" 
                    subtitle="Across all tournaments"
                    icon={<Users size={20} />}
                />
            </div>
        </div>
    );
};

// === Reusable Stat Card ===

type StatVariant = 'primary' | 'success' | 'info' | 'warning';

const StatCard = ({ 
    label, 
    value, 
    variant = 'primary', 
    subtitle,
    icon
}: { 
    label: string; 
    value: number; 
    variant?: StatVariant; 
    subtitle?: string;
    icon?: React.ReactNode;
}) => {
    
    // Safe Style Mapping
    const styles = {
        primary: {
            bg: "bg-primary/5",
            border: "border-primary/20",
            icon: "text-primary",
            text: "text-primary"
        },
        success: {
            bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
            border: "border-emerald-500/20",
            icon: "text-emerald-600 dark:text-emerald-400",
            text: "text-foreground"
        },
        info: {
            bg: "bg-blue-500/5 dark:bg-blue-500/10",
            border: "border-blue-500/20",
            icon: "text-blue-600 dark:text-blue-400",
            text: "text-foreground"
        },
        warning: {
            bg: "bg-orange-500/5 dark:bg-orange-500/10",
            border: "border-orange-500/20",
            icon: "text-orange-600 dark:text-orange-400",
            text: "text-foreground"
        }
    };

    const currentStyle = styles[variant];

    return (
        <div className={`
            relative p-5 rounded-xl border transition-all duration-200
            ${currentStyle.bg} ${currentStyle.border}
            hover:shadow-sm
        `}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {label}
                </h3>
                {icon && (
                    <div className={`p-2 rounded-lg bg-background ${currentStyle.icon}`}>
                        {icon}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <p className={`text-3xl font-bold tracking-tight ${currentStyle.text}`}>
                    {value}
                </p>
                {subtitle && (
                    <p className="text-xs font-medium text-muted-foreground/80">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ManagerStatsSection;