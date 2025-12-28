import { Hand, Activity, User } from "lucide-react"; 

interface PlayerStatsSectionProps {
    battingStyle: string;
    bowlingStyle: string;
    position: string;
}

const PlayerStatsSection = ({ battingStyle, bowlingStyle, position }: PlayerStatsSectionProps) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard 
                    label="Batting Style" 
                    value={battingStyle || "N/A"} 
                    variant="success" 
                    subtitle="Primary batting hand"
                    icon={<Hand size={20} className="rotate-90" />} // Rotated hand looks like holding a bat
                />
                <StatCard 
                    label="Bowling Style" 
                    value={bowlingStyle || "N/A"} 
                    variant="info" 
                    subtitle="Bowling technique"
                    icon={<Activity size={20} />} 
                />
                <StatCard 
                    label="Playing Position" 
                    value={position || "N/A"} 
                    variant="primary" 
                    subtitle="Preferred role"
                    icon={<User size={20} />} 
                />
            </div>
        </div>
    );
};

// === Reusable Stat Card (Same structure as ManagerStats for consistency) ===

type StatVariant = 'primary' | 'success' | 'info' | 'warning';

const StatCard = ({ 
    label, 
    value, 
    variant = 'primary', 
    subtitle,
    icon
}: { 
    label: string; 
    value: string; 
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
            text: "text-foreground"
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
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {label}
                </h3>
                {icon && (
                    <div className={`p-2 rounded-lg bg-background shadow-sm ${currentStyle.icon}`}>
                        {icon}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1">
                {/* Text is slightly smaller than numbers (text-xl instead of 3xl) to fit long cricket terms */}
                <p className={`text-xl font-bold tracking-tight ${currentStyle.text} line-clamp-2`}>
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

export default PlayerStatsSection;