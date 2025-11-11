import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { useAppDispatch } from "../../../hooks/hooks";
import { useParams } from "react-router-dom";
import { fetchPlayerDetails, userBlockStatus } from "../../../features/admin/users";
import LoadingOverlay from "../../../components/shared/LoadingOverlay";
import type { PlayerDetails } from "../../../features/admin/users/userTypes";
import UserHeader from "../../../components/admin/details/UserHeader";
import PlayerStatsSection from "../../../components/admin/details/PlayerStatsSection";
import SectionDivider from "../../../components/ui/SectionDivider";
import InfoGrid from "../../../components/admin/details/InfoGrid";
import toast from "react-hot-toast";

const PlayerDetails = () => {
    const [player, setPlayer] = useState<PlayerDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();
    const { id } = useParams();

    useEffect(() => {
        const getDetails = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const result = await dispatch(fetchPlayerDetails(id)).unwrap();
                setPlayer(result);
            } catch (error) {
                console.error("Failed to fetch player details:", error);
            } finally {
                setLoading(false);
            }
        };

        getDetails();
        return () => setPlayer(null);
    }, [dispatch, id]);

    const blockUser = async () => {
        if (!player) return;

        const previousState = player.isBlocked;
        setPlayer({ ...player, isBlocked: !player.isBlocked });

        try {
            await dispatch(userBlockStatus({ userId: player._id, isActive: !player.isBlocked }));
        } catch (error) {
            console.error("Failed to update user block status:", error);

            setPlayer({ ...player, isBlocked: previousState });
            toast("Failed to update block status. Please try again.");
        }
    };

    return (
        <AdminLayout>
            <LoadingOverlay show={loading} />

            {!loading && player && (
                <div className="text-neutral-100 mt-10">
                    <div className="max-w-6xl mx-auto bg-neutral-800 rounded-2xl shadow-2xl p-6 border border-neutral-700">
                        <UserHeader user={player} onToggleBlock={blockUser} />
                        <SectionDivider />
                        <InfoGrid
                            data={[
                                { label: "Full Name", value: player.fullName, color: "emerald" },
                                { label: "Username", value: `@${player.username}`, color: "blue" },
                                { label: "Email", value: player.email, color: "purple" },
                                { label: "Phone", value: player.phone, color: "red" },
                                { label: "Status", value: player.status, color: "emerald" },
                                { label: "Subscription", value: player.subscription, color: "emerald" },
                            ]}
                        />
                        <SectionDivider />
                        <PlayerStatsSection
                            battingStyle={player.stats?.battingStyle || 'Not Updated'}
                            bowlingStyle={player.stats?.bowlingStyle || 'Not Updated'}
                            position={player.stats?.position || 'Not Updated'}
                        />
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default PlayerDetails;