import ManagerLayout from "../layout/ManagerLayout";
import { Header } from "../../components/manager/manageMembers/Header";
import { ActivePlayersSection } from "../../components/manager/manageMembers/ActivePlayersSection";
import { SubstitutePlayersSection } from "../../components/manager/manageMembers/SubstitutePlayersSection";
import { useParams } from "react-router-dom";
import { useManageMembers } from "../../hooks/manager/useManageMembers";
import TeamPlayerModal from "../../components/manager/manageMembers/TeamPlayerModal";

export default function ManageMembersPage() {
    const { teamId } = useParams<{ teamId: string }>();
    const { loading, team, players,
        activePlayers,
        substitutePlayers,
        selectedPlayer,
        viewPlayer,
        swapMode,
        cancelSwap,
        handlePlayerAction,
        isModalOpen,
        setIsModalOpen
    } = useManageMembers(teamId);

    if (loading || !team) {
        return (
            <ManagerLayout>
                <p className="text-white py-8">Loading team...</p>
            </ManagerLayout>
        );
    }

    return (
        <ManagerLayout>
            <div className="text-white py-8">
                <Header team={team} playersCount={players.length} />

                <ActivePlayersSection
                    team={team}
                    activePlayers={activePlayers}
                    selectedPlayer={selectedPlayer}
                    swapMode={swapMode}
                    cancelSwap={cancelSwap}
                    handlePlayerAction={handlePlayerAction}
                />

                <SubstitutePlayersSection
                    substitutePlayers={substitutePlayers}
                    selectedPlayer={selectedPlayer}
                    swapMode={swapMode}
                    cancelSwap={cancelSwap}
                    handlePlayerAction={handlePlayerAction}
                />
            </div>

            {viewPlayer && (
                <TeamPlayerModal
                    player={viewPlayer}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </ManagerLayout>
    );
}
