import { Clock } from 'lucide-react';

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
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden min-h-full xl:col-span-3">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-neutral-800 dark:text-white">
                        {activeTab === 'pending' ? 'Pending Requests' : 'Team Members'}
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {activeTab === 'pending'
                            ? `${pendingPlayers.length} pending`
                            : `${approvedPlayers.length} of ${team.maxPlayers} players`}
                    </p>
                </div>

                {pendingPlayers.length > 0 && (
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'members'
                                ? 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white shadow-sm'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
                                }`}
                        >
                            Members ({approvedPlayers.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'pending'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 shadow-sm'
                                : 'text-neutral-600 dark:text-neutral-400 hover:text-yellow-700 dark:hover:text-yellow-300'
                                }`}
                        >
                            <Clock className="w-4 h-4 inline mr-1" />
                            Pending ({pendingPlayers.length})
                        </button>
                    </div>
                )}
            </div>

            <div className="p-6">
                {activeTab === 'pending' ? (
                    <PendingList
                        players={pendingPlayers}
                        openPlayerDetails={openPlayerDetails}
                        openApprovalModal={openApprovalModal}
                    />
                ) : (
                    <MembersList
                        players={approvedPlayers}
                        openPlayerDetails={openPlayerDetails}
                        openRemoveModal={openRemoveModal}
                    />
                )}
            </div>
        </div>
    );
};

export default PlayersSection;
