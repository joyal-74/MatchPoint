import ManagerLayout from "../layout/ManagerLayout";
import { Header } from "../../components/manager/manageMembers/Header";
import { ActivePlayersSection } from "../../components/manager/manageMembers/ActivePlayersSection";
import { SubstitutePlayersSection } from "../../components/manager/manageMembers/SubstitutePlayersSection";
import { useParams } from "react-router-dom";
import { useManageMembers } from "../../hooks/manager/useManageMembers";

export default function ManageMembersPage() {
    const { teamId } = useParams<{ teamId: string }>();
    const { loading, team, players,
        activePlayers,
        substitutePlayers,
        selectedPlayer,
        swapMode,
        cancelSwap,
        handlePlayerAction,
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
        </ManagerLayout>
    );
}
