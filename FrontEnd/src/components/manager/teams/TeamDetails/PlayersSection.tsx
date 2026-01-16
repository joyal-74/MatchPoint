import { Clock, Users } from 'lucide-react';
import type { PlayerDetails, Team } from '../Types';
import PendingList from './PendingList';
import MembersList from './MembersList';

const PlayersSection = ({
    team,
    activeTab,
    setActiveTab,
    openPlayerDetails,
    openApprovalModal,
    openRemoveModal,
}: {
    team: Team;
    activeTab: 'members' | 'pending';
    setActiveTab: (tab: 'members' | 'pending') => void;
    openPlayerDetails: (player: PlayerDetails) => void;
    openApprovalModal: (player: PlayerDetails) => void;
    openRemoveModal: (player: PlayerDetails) => void;
}) => {
    const approvedPlayers = team.members?.filter((p: PlayerDetails) => p.approvalStatus === 'approved') || [];
    const pendingPlayers = team.members?.filter((p: PlayerDetails) => p.approvalStatus === 'pending') || [];
    
    return (
        <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm flex flex-col h-full min-h-[600px]">
            
            {/* Toolbar Header */}
            <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                
                {/* Title & Tabs */}
                <div className="flex flex-col gap-4 w-full sm:w-auto">                    
                    {/* Modern Underline Tabs */}
                    <div className="flex gap-6 -mb-[17px]">
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`
                                pb-4 text-sm font-medium transition-all border-b-2 flex items-center gap-2
                                ${activeTab === 'members' 
                                    ? 'border-primary text-foreground' 
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                }
                            `}
                        >
                            <Users size={14} />
                            Active Members
                            <span className="bg-muted text-muted-foreground px-1.5 rounded-md text-xs">{approvedPlayers.length}</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`
                                pb-4 text-sm font-medium transition-all border-b-2 flex items-center gap-2
                                ${activeTab === 'pending' 
                                    ? 'border-primary text-foreground' 
                                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                }
                            `}
                        >
                            <Clock size={14} />
                            Requests
                            {pendingPlayers.length > 0 && (
                                <span className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 px-1.5 rounded-md text-xs animate-pulse">
                                    {pendingPlayers.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

            </div>

            {/* Scrollable Content Area */}
            <div className="p-6 flex-1 bg-muted/5">
                {activeTab === 'pending' ? (
                    <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                        <PendingList
                            players={pendingPlayers}
                            openPlayerDetails={openPlayerDetails}
                            openApprovalModal={openApprovalModal}
                        />
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                        <MembersList
                            players={approvedPlayers}
                            openPlayerDetails={openPlayerDetails}
                            openRemoveModal={openRemoveModal}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlayersSection;