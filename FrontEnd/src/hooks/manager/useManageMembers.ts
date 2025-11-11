import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import type { RootState } from "../../app/store";
import type { TeamPlayer } from "../../types/Player";
import { getAllTeams, updatePlayerStatus } from "../../features/manager";


export function useManageMembers(teamId?: string) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { teams, loading } = useAppSelector((state) => state.manager);
    const { user, isInitialized } = useAppSelector((state: RootState) => state.auth);
    const managerId = user?._id;

    const [players, setPlayers] = useState<TeamPlayer[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<TeamPlayer | null>(null);
    const [swapMode, setSwapMode] = useState(false);

    // fetch teams
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

    const team = teams.find((t) => t._id === teamId) || null;

    // map team members to players
    useEffect(() => {
        if (team && team.members) {
            const mapped: TeamPlayer[] = team.members.map((m) => ({
                id: m.playerId,
                name: `${m.firstName} ${m.lastName}`,
                position: String(m.profile.position),
                jerseyNumber: Number(m.profile?.jerseyNumber || 0),
                status: m.status,
                profileImage: m.profileImage,
                approvalStatus : m.approvalStatus
            }));
            setPlayers(mapped);
        }
    }, [team]);

    const activePlayers = players.filter((p) => p.status === "playing" && p.approvalStatus === 'approved');
    const substitutePlayers = players.filter((p) => p.status === "substitute" && p.approvalStatus === 'approved');

    // backend update helper
    const updateStatus = async (playerId: string, status: string) => {
        await dispatch(updatePlayerStatus({ teamId: teamId!, playerId, status })).unwrap(); 
    };


    const handleSwapPlayers = async (player1: TeamPlayer, player2: TeamPlayer) => {
        // Optimistic update
        setPlayers((prev) =>
            prev.map((p) => {
                if (p.id === player1.id) return { ...p, status: player2.status };
                if (p.id === player2.id) return { ...p, status: player1.status };
                return p;
            })
        );

        try {
            await Promise.all([
                updateStatus(player1.id, player2.status),
                updateStatus(player2.id, player1.status),
            ]);
            toast.success("Players swapped successfully!");
        } catch {
            toast.error("Failed to swap players.");
            // revert
            setPlayers((prev) =>
                prev.map((p) => {
                    if (p.id === player1.id) return { ...p, status: player1.status };
                    if (p.id === player2.id) return { ...p, status: player2.status };
                    return p;
                })
            );
        }

        setSelectedPlayer(null);
        setSwapMode(false);
    };

    const handlePlayerAction = async (
        action: "swap" | "makeSubstitute" | "makeActive" | "view",
        player: TeamPlayer
    ) => {
        if (action === "swap") {
            if (swapMode && selectedPlayer && selectedPlayer.id !== player.id) {
                await handleSwapPlayers(selectedPlayer, player);
            } else {
                setSelectedPlayer(player);
                setSwapMode(true);
            }
        } else if (action === "makeSubstitute" || action === "makeActive") {
            const newStatus = action === "makeSubstitute" ? "substitute" : "playing";
            setPlayers((prev) =>
                prev.map((p) => (p.id === player.id ? { ...p, status: newStatus } : p))
            );
            await updateStatus(player.id, newStatus);
        } else if (action === "view") {
            console.log("View player:", player);
        }
    };

    const cancelSwap = () => {
        setSelectedPlayer(null);
        setSwapMode(false);
    };

    return {
        loading,
        team,
        players,
        activePlayers,
        substitutePlayers,
        selectedPlayer,
        swapMode,
        cancelSwap,
        handlePlayerAction,
    };
}
