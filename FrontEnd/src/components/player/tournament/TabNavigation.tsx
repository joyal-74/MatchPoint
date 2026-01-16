interface TabNavigationProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabNavigation = ({ activeTab, setActiveTab }: TabNavigationProps) => {
    const tabs = [
        { label: 'Overview', value: 'overview' },
        { label: 'Matches', value: 'matches' },
        { label: 'Points Table', value: 'points table' },
        { label: 'Stats', value: 'stats' },
        { label: 'Rules', value: 'rules' },
        { label: 'Teams', value: 'teams' }
    ];

    return (
        <div className="border-b border-border">
            <div className="flex gap-8 overflow-x-auto no-scrollbar pb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`text-sm font-semibold tracking-wide transition-all relative whitespace-nowrap ${
                            activeTab === tab.value ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TabNavigation;