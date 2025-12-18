import React from 'react';
import { Trophy, Users, Activity, Calendar } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: number | string;
    icon: React.ReactNode;
    trend?: string;
    color: string;
}

const StatCard = ({ label, value, icon, trend, color }: StatCardProps) => (
    <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-5 flex items-start justify-between hover:bg-neutral-800 transition-colors duration-300">
        <div>
            <p className="text-neutral-400 text-sm font-medium mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
            {trend && <p className="text-xs text-neutral-500 mt-2">{trend}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white`}>
            {icon}
        </div>
    </div>
);

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
                icon={<Trophy size={20} className="text-green-400" />}
                color="bg-green-500/20"
                trend="Currently managing"
            />
            <StatCard 
                label="Total Participants" 
                value="--" // You can plug real data here later
                icon={<Users size={20} className="text-blue-400" />}
                color="bg-blue-500/20"
                trend="Across all events"
            />
            <StatCard 
                label="Live Matches" 
                value="0" 
                icon={<Activity size={20} className="text-red-400" />}
                color="bg-red-500/20"
                trend="Happening now"
            />
            <StatCard 
                label="Available to Join" 
                value={totalExploreCount} 
                icon={<Calendar size={20} className="text-purple-400" />}
                color="bg-purple-500/20"
                trend="Explore new events"
            />
        </div>
    );
}