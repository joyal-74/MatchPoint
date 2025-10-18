import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ManagerLayout from "../layout/ManagerLayout";
import { SubstitutePlayersSection } from "../../components/manager/manageMembers/SubstitutePlayersSection";
import { ActivePlayersSection } from "../../components/manager/manageMembers/ActivePlayersSection";
import { SwapBanner } from "../../components/manager/manageMembers/SwapBanner";
import { Header } from "../../components/manager/manageMembers/Header";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { getAllTeams } from "../../features/manager";
import type { RootState } from "../../app/store";
import type { Player } from "../../types/Player";
import type { Members } from "../../features/player/playerTypes";


export default function ManageMembersPage() {
    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [players, setPlayers] = useState<Player[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [swapMode, setSwapMode] = useState<boolean>(false);

    const { teams, loading } = useAppSelector((state) => state.manager);
    const { user, isInitialized } = useAppSelector((state: RootState) => state.auth);
    const managerId = user?._id;

    // Fetch teams if not already loaded
    useEffect(() => {
        if (!isInitialized) return;

        if (!managerId) {
            toast.error("Please login to access");
            navigate("/");
            return;
        }

        if (teams.length === 0) {
            dispatch(getAllTeams(managerId));
        }
    }, [dispatch, managerId, isInitialized, navigate, teams.length]);

    // Find the selected team
    const team = teams.find(t => t._id === teamId) || null;

    // Initialize players from team.members when team is available
    useEffect(() => {
        if (team && team.members) {
            const mappedPlayers : Members = team.members.map(member => ({
                id: member.playerId,
                name: `${member.firstName} ${member.lastName}`,
                position: member.profile?.position || "",
                jerseyNumber: Number(member.profile?.jerseyNumber || 0),
                status: member.status === "sub" ? "substitute" : "active",
                skills: [], // add skills if available
                joinDate: "", // add joinDate if available
                performance: 0, // calculate if needed
                profileImage: member.profileImage,
            }));
            setPlayers(mappedPlayers);
        }
    }, [team]);

    console.log(players)

    // Player arrays
    const activePlayers = players.filter((p) => p.status === "active");
    const substitutePlayers = players.filter((p) => p.status === "substitute");

    /** 🔄 Swap logic */
    const handleSwapPlayers = (player1: Player, player2: Player) => {
        setPlayers(prev =>
            prev.map(p => {
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
    ) => {
        if (action === "swap") {
            if (swapMode && selectedPlayer && selectedPlayer.id !== player.id) {
                handleSwapPlayers(selectedPlayer, player);
            } else {
                setSelectedPlayer(player);
                setSwapMode(true);
            }
        } else if (action === "makeSubstitute") {
            setPlayers(prev =>
                prev.map(p => (p.id === player.id ? { ...p, status: "substitute" } : p))
            );
        } else if (action === "makeActive") {
            setPlayers(prev =>
                prev.map(p => (p.id === player.id ? { ...p, status: "active" } : p))
            );
        } else if (action === "view") {
            console.log("View player:", player);
        }
    };

    const cancelSwap = () => {
        setSelectedPlayer(null);
        setSwapMode(false);
    };

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
