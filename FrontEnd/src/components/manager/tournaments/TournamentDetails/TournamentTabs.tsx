import { Info, UserCog, CalendarDays, Swords, Trophy, Users, BarChart3 } from "lucide-react";
import type { TabType } from "./tabs/TabContent";

interface TournamentTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const tabs = [
    { id: "info" as TabType, label: "Overview", icon: Info },
    { id: "teams" as TabType, label: "Teams", icon: UserCog },
    { id: "fixtures" as TabType, label: "Fixtures", icon: CalendarDays },
    { id: "matches" as TabType, label: "Matches", icon: Swords },
    { id: "results" as TabType, label: "Results", icon: Trophy },
    { id: "groups" as TabType, label: "Groups", icon: Users },
    { id: "leaderboard" as TabType, label: "Stats", icon: BarChart3 },
];

export default function TournamentTabs({ activeTab, onTabChange }: TournamentTabsProps) {
    return (
        <div className="sticky top-16 z-40 w-full bg-neutral-950/80 backdrop-blur-xl border-b border-white/5">
            <div className="w-full px-4 md:px-8 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-6 min-w-max">
                    {tabs.map((tab) => {
                        const IconComponent = tab.icon;
                        const isActive = activeTab === tab.id;
                        
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`
                                    group flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-all duration-200
                                    ${isActive 
                                        ? "border-emerald-500 text-white" 
                                        : "border-transparent text-neutral-500 hover:text-neutral-300 hover:border-neutral-700"
                                    }
                                `}
                            >
                                <IconComponent 
                                    size={16} 
                                    className={`transition-colors duration-200 ${isActive ? "text-emerald-400" : "group-hover:text-neutral-300"}`} 
                                />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}