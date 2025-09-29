import { TrendingUp, type LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

interface StatsCardProps {
  stat: Stat;
}

const StatsCard = ({ stat }: StatsCardProps) => (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {stat.label}
                </p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-xs text-green-400">+12% this month</span>
                </div>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
        </div>
    </div>
);

export default StatsCard;