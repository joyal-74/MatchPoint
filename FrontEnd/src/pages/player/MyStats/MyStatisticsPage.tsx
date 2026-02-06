import React, { useEffect, useState } from 'react';
import { fetchPlayerStatsData } from '../../../features/player/playerThunks';
import { sportCareerStatsConfig } from '../../../utils/sportsConfig';
import StatsTable from './StatsTable';
import PlayerLayout from '../../layout/PlayerLayout';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';

type StatCategory = 'batting' | 'bowling' | 'fielding';

const MyStatisticsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [activeTab, setActiveTab] = useState<StatCategory>('batting');

    const { player, loading, error } = useAppSelector((state) => state.player);
    const userId = useAppSelector((state) => state.auth.user?._id);

    useEffect(() => {
        if (userId) dispatch(fetchPlayerStatsData(userId));
    }, [dispatch, userId]);

    if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground animate-pulse">LOADING ANALYTICS...</div>;
    if (error) return <div className="p-10 text-destructive bg-destructive/10 border border-destructive rounded-lg m-4">Error: {error}</div>;

    const tabs: { id: StatCategory; label: string }[] = [
        { id: 'batting', label: 'BATTING' },
        { id: 'bowling', label: 'BOWLING' },
        { id: 'fielding', label: 'FIELDING' },
    ];

    return (
        <PlayerLayout>
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold">
                            Career Stats
                        </h1>
                        <p className="text-muted-foreground font-medium">Professional Performance Overview</p>
                    </div>

                    {/* Pro Segmented Control */}
                    <div className="inline-flex p-1 bg-muted rounded-lg border border-border shadow-inner">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-8 py-2 text-xs font-black rounded-md transition-all duration-200 ${
                                    activeTab === tab.id 
                                        ? 'bg-primary text-primary-foreground shadow-md' 
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Stats Container */}
                <div className="bg-card border border-border rounded-2xl mt-12 p-6 md:p-12 shadow-2xl relative overflow-hidden">
                    <StatsTable 
                        title={`${activeTab} Summary`}
                        fields={sportCareerStatsConfig.cricket[activeTab]}
                        data={player?.stats?.[activeTab]}
                    />
                </div>
            </div>
        </PlayerLayout>
    );
};

export default MyStatisticsPage;