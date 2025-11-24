import { Info, UserCog, CalendarDays, Swords, Trophy as TrophyIcon, UsersRound, BarChart3 } from "lucide-react";
import type { TabType } from "./tabs/TabContent";


interface TournamentTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const tabs = [
    { id: "info" as TabType, label: "Information", icon: Info },
    { id: "teams" as TabType, label: "Teams", icon: UserCog },
    { id: "fixtures" as TabType, label: "Fixtures", icon: CalendarDays },
    { id: "matches" as TabType, label: "Matches", icon: Swords },
    { id: "results" as TabType, label: "Results", icon: TrophyIcon },
    { id: "groups" as TabType, label: "Groups", icon: UsersRound },
    { id: "leaderboard" as TabType, label: "Leaderboard", icon: BarChart3 },
];

export default function TournamentTabs({ activeTab, onTabChange }: TournamentTabsProps) {
    return (
        <div className="mb-3">
            <div className="flex">
                <div className="flex justify-between w-full bg-neutral-800/30 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-1">
                    {tabs.map((tab) => {
                        const IconComponent = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                                    : "text-neutral-400 hover:text-white hover:bg-neutral-700/50"
                                    }`}
                            >
                                <IconComponent size={18} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}