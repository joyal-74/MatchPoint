import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import type { RootState } from "../../app/store";
import type { TeamPlayer } from "../../types/Player";
import { addPlayerToTeam, getAllTeams, getAvailablePlayers, updatePlayerStatus } from "../../features/manager";
import toast from "react-hot-toast";

export function useManageMembers(teamId: string) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { teams, loading } = useAppSelector((state) => state.manager);
    const { user, isInitialized } = useAppSelector((state: RootState) => state.auth);
    const managerId = user?._id;

    const [players, setPlayers] = useState<TeamPlayer[]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<TeamPlayer | null>(null);
    const [swapMode, setSwapMode] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewPlayer, setViewPlayer] = useState<TeamPlayer | null>(null);

    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
    const [availablePlayers, setAvailablePlayers] = useState<TeamPlayer[]>([]);


    console.log(availablePlayers, '-----------------')
    console.log(players, '++++++++')
    // Fetch teams on mount
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

    // Map team members to players
    useEffect(() => {
        if (team && team.members) {
            const mapped: TeamPlayer[] = team.members.map((m) => ({
                _id: m.playerId,
                userId : m.userId,
                name: `${m.firstName} ${m.lastName}`,
                email: m.email,
                phone: m.phone,
                role : m.role,
                position: String(m.profile.position),
                jerseyNumber: Number(m.profile?.jerseyNumber || 0),
                status: m.status,
                profileImage: m.profileImage,
                approvalStatus: m.approvalStatus
            }));
            setPlayers(mapped);
        }
    }, [team]);

    // Memoized filtered arrays
    const activePlayers = useMemo(
        () => players.filter((p) => p.status === "playing" && p.approvalStatus === 'approved'),
        [players]
    );

    const substitutePlayers = useMemo(
        () => players.filter((p) => p.status === "substitute" && p.approvalStatus === 'approved'),
        [players]
    );

    // Backend update helper
    const updateStatus = async (playerId: string, status: string) => {
        await dispatch(updatePlayerStatus({ teamId: teamId!, playerId, status })).unwrap();
    };

    const fetchAvailablePlayers = useCallback(async () => {
        try {
            const result = await dispatch(getAvailablePlayers(teamId)).unwrap();
            setAvailablePlayers(result);
        } catch (err) {
            console.error("Failed to fetch available players:", err);
            toast.error("Failed to fetch available players.");
        }
    }, [teamId, dispatch]);

    const handleAddPlayer = async (playerId: string, userId: string) => {
        if (!teamId) {
            toast.error("Team ID missing.");
            return;
        }

        const result = await dispatch(addPlayerToTeam({ teamId, userId, playerId }));

        if (addPlayerToTeam.fulfilled.match(result)) {
            toast.success(result.payload.message || "Request submitted.");
            setIsSelectionModalOpen(false);
        }
        else {
            toast.error(result.payload || "Something went wrong.");
        }
    };


    const handleSwapPlayers = async (player1: TeamPlayer, player2: TeamPlayer) => {
        // Optimistic update
        setPlayers(prev =>
            prev.map(p => {
                if (p._id === player1._id) return { ...p, status: player2.status };
                if (p._id === player2._id) return { ...p, status: player1.status };
                return p;
            })
        );

        try {
            await Promise.all([
                updateStatus(player1._id, player2.status),
                updateStatus(player2._id, player1.status),
            ]);
            toast.success("Players swapped successfully!");
        } catch {
            toast.error("Failed to swap players.");
            // revert
            setPlayers(prev =>
                prev.map(p => {
                    if (p._id === player1._id) return { ...p, status: player1.status };
                    if (p._id === player2._id) return { ...p, status: player2.status };
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
            if (swapMode && selectedPlayer && selectedPlayer._id !== player._id) {
                await handleSwapPlayers(selectedPlayer, player);
            } else {
                setSelectedPlayer(player);
                setSwapMode(true);
            }
        } else if (action === "makeSubstitute" || action === "makeActive") {
            const newStatus = action === "makeSubstitute" ? "substitute" : "playing";
            const prevStatus = player.status;

            // Optimistic update with revert on failure
            setPlayers(prev =>
                prev.map(p => p._id === player._id ? { ...p, status: newStatus } : p)
            );

            try {
                await updateStatus(player._id, newStatus);
            } catch {
                toast.error("Failed to update player status.");
                setPlayers(prev =>
                    prev.map(p => p._id === player._id ? { ...p, status: prevStatus } : p)
                );
            }
        } else if (action === "view") {
            setViewPlayer(player);
            setIsModalOpen(true);
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
        viewPlayer,
        substitutePlayers,
        selectedPlayer,
        swapMode,

        isSelectionModalOpen,
        setIsSelectionModalOpen,
        availablePlayers,
        fetchAvailablePlayers,
        handleAddPlayer,

        cancelSwap,
        handlePlayerAction,
        isModalOpen,
        setIsModalOpen
    };
}
