import { Info, UserCog, CalendarDays, Swords, Trophy, BarChart3, ListOrdered } from "lucide-react";
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
    { id: "points" as TabType, label: "Points Table", icon: ListOrdered },
    { id: "results" as TabType, label: "Results", icon: Trophy },
    { id: "leaderboard" as TabType, label: "Stats", icon: BarChart3 },
];

export default function TournamentTabs({ activeTab, onTabChange }: TournamentTabsProps) {
    return (
        <div className="sticky top-16 z-40 w-full bg-background/95 backdrop-blur-xl border-b border-border transition-colors duration-300">
            <div className="w-full overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-10 min-w-max">
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
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/20"
                                    }
                                `}
                            >
                                <IconComponent
                                    size={16}
                                    className={`transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
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