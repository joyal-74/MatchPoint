import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../hooks/hooks";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlayerDetails, userBlockStatus } from "../../../features/admin/users";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

import AdminLayout from "../../layout/AdminLayout";
import LoadingOverlay from "../../../components/shared/LoadingOverlay";
import type { PlayerDetails } from "../../../features/admin/users/userTypes";
import UserHeader from "../../../components/admin/details/UserHeader";
import PlayerStatsSection from "../../../components/admin/details/PlayerStatsSection";
import InfoGrid from "../../../components/admin/details/InfoGrid";

const PlayerDetails = () => {
    const [player, setPlayer] = useState<PlayerDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getDetails = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const result = await dispatch(fetchPlayerDetails(id)).unwrap();
                setPlayer(result);
            } catch (error) {
                console.error("Failed to fetch player details:", error);
                toast.error("Could not load player details");
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
        
        // Optimistic UI update
        setPlayer({ ...player, isBlocked: !player.isBlocked });

        try {
            await dispatch(userBlockStatus({ userId: player._id, isActive: !player.isBlocked }));
            toast.success(player.isBlocked ? "User unblocked successfully" : "User blocked successfully");
        } catch (error) {
            console.error("Failed to update user block status:", error);
            // Revert state
            setPlayer({ ...player, isBlocked: previousState });
            toast.error("Failed to update block status. Please try again.");
        }
    };

    return (
        <AdminLayout>
            <LoadingOverlay show={loading} />

            <div className="p-4 sm:p-6 lg:p-8 mx-auto min-h-[80vh]">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Players</span>
                </button>

                {!loading && player ? (
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* 1. Header Section */}
                        <div className="p-6 sm:p-8 border-b border-border bg-muted/20">
                            <UserHeader user={player} onToggleBlock={blockUser} />
                        </div>

                        {/* 2. Personal Information Grid */}
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-1 h-5 bg-primary rounded-full" />
                                <h3 className="text-lg font-semibold text-foreground">
                                    Personal Information
                                </h3>
                            </div>
                            
                            <InfoGrid
                                data={[
                                    { label: "Full Name", value: player.fullName },
                                    { label: "Username", value: `@${player.username}` },
                                    { label: "Email", value: player.email },
                                    { label: "Phone", value: player.phone || "N/A" },
                                    { label: "Account Status", value: player.isBlocked ? "Suspended" : "Active" },
                                    { label: "Subscription", value: player.subscription || "Free Tier" },
                                ]}
                            />
                        </div>

                        {/* 3. Stats Section */}
                        <div className="p-6 sm:p-8 bg-muted/5 border-t border-border">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-1 h-5 bg-secondary rounded-full" />
                                <h3 className="text-lg font-semibold text-foreground">
                                    Cricket Profile
                                </h3>
                            </div>
                            
                            <PlayerStatsSection
                                battingStyle={player.stats?.battingStyle || 'Not Updated'}
                                bowlingStyle={player.stats?.bowlingStyle || 'Not Updated'}
                                position={player.stats?.position || 'Not Updated'}
                            />
                        </div>
                    </div>
                ) : (
                    !loading && (
                        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl bg-card">
                            <p className="text-muted-foreground text-lg">Player details not found</p>
                            <button 
                                onClick={() => navigate(-1)}
                                className="mt-4 text-primary hover:underline"
                            >
                                Go Back
                            </button>
                        </div>
                    )
                )}
            </div>
        </AdminLayout>
    );
};

export default PlayerDetails;