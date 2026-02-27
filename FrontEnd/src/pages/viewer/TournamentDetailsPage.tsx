import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlayerLayout from '../../pages/layout/PlayerLayout';
import { useTournamentDetails } from '../../hooks/player/useTournamentDetails';
import LoadingSkeleton from '../../components/player/tournament/LoadingSkeleton';
import OverviewTab from '../../components/player/tournament/tabs/OverviewTab';
import MatchesTab from '../../components/player/tournament/tabs/MatchesTab';
import PointsTableTab from '../../components/player/tournament/tabs/PointsTableTab';
import StatsTab from '../../components/player/tournament/tabs/StatsTab';
import RulesTab from '../../components/player/tournament/tabs/RulesTab';
import TeamsTab from '../../components/player/tournament/tabs/TeamsTab';
import TournamentHeader from '../../components/player/tournament/TournamentHeader';
import TabNavigation from '../../components/player/tournament/TabNavigation';



const TournamentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { tournament, isLoading } = useTournamentDetails(id);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!id) {
            navigate('/tournaments');
        }
    }, [id, navigate]);

    if (isLoading || !tournament) {
        return (
            <PlayerLayout>
                <LoadingSkeleton />
            </PlayerLayout>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab tournament={tournament} />;
            case 'matches':
                return <MatchesTab />;
            case 'points table':
                return <PointsTableTab />;
            case 'stats':
                return <StatsTab />;
            case 'rules':
                return <RulesTab rules={tournament.rules || []} />;
            case 'teams':
                return <TeamsTab tournament={tournament} />;
            default:
                return <OverviewTab tournament={tournament} />;
        }
    };

    return (
        <PlayerLayout>
            <div className="min-h-screen bg-background text-foreground pb-20">
                <div className="mx-auto px-4 sm:px-6">
                    <TournamentHeader tournament={tournament} navigate={navigate} />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mt-12">
                        <div className="lg:col-span-2 space-y-8">
                            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
                            <div className="min-h-[400px]">
                                {renderTabContent()}
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </PlayerLayout>
    );
};

export default TournamentDetails;