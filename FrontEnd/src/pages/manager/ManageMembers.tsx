import { useState } from "react";
import ManagerLayout from "../layout/ManagerLayout";
import { playerData } from "../../utils/SamplePlayers";
import { SubstitutePlayersSection } from "../../components/manager/manageMembers/SubstitutePlayersSection";
import { ActivePlayersSection } from "../../components/manager/manageMembers/ActivePlayersSection";
import { SwapBanner } from "../../components/manager/manageMembers/SwapBanner";
import { Header } from "../../components/manager/manageMembers/Header";

export interface Player {
    id: number;
    name: string;
    position: string;
    jerseyNumber: number;
    status: "active" | "substitute";
    skills: string[];
    joinDate: string;
    performance: number;
}

export interface Team {
    id: number;
    name: string;
    sport: string;
    maxPlayers: number;
}

interface Props {
    teamId: number;
}

export default function ManageMembersPage({ teamId }: Props) {
    const [players, setPlayers] = useState<Player[]>(playerData);

    const [team] = useState<Team>({
        id: teamId,
        name: "Thunder Strikers",
        sport: "Cricket",
        maxPlayers: 15,
    });

    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [swapMode, setSwapMode] = useState<boolean>(false);

    const activePlayers = players.filter((p) => p.status === "active");
    const substitutePlayers = players.filter((p) => p.status === "substitute");

    /** 🔄 Swap logic */
    const handleSwapPlayers = (player1: Player, player2: Player): void => {
        setPlayers((prevPlayers) =>
            prevPlayers.map((p) => {
                if (p.id === player1.id) return { ...p, status: player2.status };
                if (p.id === player2.id) return { ...p, status: player1.status };
                return p;
            })
        );
        setSelectedPlayer(null);
        setSwapMode(false);
    };

    /** 🎯 Player Actions */
    const handlePlayerAction = (
        action: "swap" | "makeSubstitute" | "makeActive" | "view",
        player: Player
    ): void => {
        if (action === "swap") {
            if (swapMode && selectedPlayer && selectedPlayer.id !== player.id) {
                handleSwapPlayers(selectedPlayer, player); // ✅ now swap works
            } else {
                setSelectedPlayer(player);
                setSwapMode(true);
            }
        } else if (action === "makeSubstitute") {
            setPlayers((prev) =>
                prev.map((p) =>
                    p.id === player.id ? { ...p, status: "substitute" } : p
                )
            );
        } else if (action === "makeActive") {
            setPlayers((prev) =>
                prev.map((p) => (p.id === player.id ? { ...p, status: "active" } : p))
            );
        } else if (action === "view") {
            console.log("View player:", player);
        }
    };

    const cancelSwap = (): void => {
        setSelectedPlayer(null);
        setSwapMode(false);
    };

    return (
        <ManagerLayout>
            <div className="text-white py-8">
                {/* Header */}
                <Header
                    team={team}
                    playersCount={players.length}
                    swapMode={swapMode}
                    selectedPlayer={selectedPlayer}
                    cancelSwap={cancelSwap}
                />

                {/* Swap Banner */}
                {swapMode && selectedPlayer && (
                    <SwapBanner player={selectedPlayer} cancelSwap={cancelSwap} />
                )}

                {/* Active Players */}
                <ActivePlayersSection
                    team={team}
                    activePlayers={activePlayers}
                    selectedPlayer={selectedPlayer}
                    swapMode={swapMode}
                    handlePlayerAction={handlePlayerAction}
                />

                {/* Substitutes */}
                <SubstitutePlayersSection
                    substitutePlayers={substitutePlayers}
                    selectedPlayer={selectedPlayer}
                    swapMode={swapMode}
                    handlePlayerAction={handlePlayerAction}
                />
            </div>
        </ManagerLayout>
    );
}
