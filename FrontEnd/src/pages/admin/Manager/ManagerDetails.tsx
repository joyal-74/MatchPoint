import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../hooks/hooks';
import type { ManagerDetails } from '../../../features/admin/users/userTypes';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchManagerDetails, userBlockStatus } from '../../../features/admin/users';
import { ArrowLeft } from 'lucide-react';

import AdminLayout from '../../layout/AdminLayout';
import LoadingOverlay from '../../../components/shared/LoadingOverlay';
import ManagerStatsSection from '../../../components/admin/details/ManagerStatsSection';
import UserHeader from '../../../components/admin/details/UserHeader';
import InfoGrid from '../../../components/admin/details/InfoGrid';

const ManagerDetails = () => {
    const [manager, setManager] = useState<ManagerDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await dispatch(fetchManagerDetails(id)).unwrap();
                setManager(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, dispatch]);

    const blockUser = async () => {
        if (!manager) return;

        const previousState = manager.isBlocked;
        // Optimistic UI Update
        setManager({ ...manager, isBlocked: !manager.isBlocked });

        try {
            await dispatch(
                userBlockStatus({ userId: manager._id, isActive: !manager.isBlocked })
            );
        } catch (error) {
            console.error("Failed to update user block status:", error);
            // Revert on failure
            setManager({ ...manager, isBlocked: previousState });
        }
    };

    return (
        <AdminLayout>
            <LoadingOverlay show={loading} />
            
            <div className="p-4 sm:p-6 lg:p-8 mx-auto">
                
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                    <ArrowLeft size={16} />
                    <span>Back to Managers</span>
                </button>

                {!loading && manager ? (
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* 1. Header Section */}
                        <div className="p-6 sm:p-8 border-b border-border bg-muted/20">
                            <UserHeader user={manager} onToggleBlock={blockUser} />
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
                                    { label: "Full Name", value: manager.fullName },
                                    { label: "Username", value: `@${manager.username}` },
                                    { label: "Email", value: manager.email },
                                    { label: "Phone", value: manager.phone || "N/A" },
                                    { label: "Subscription", value: manager.subscription },
                                    // Status is already in header, but keeping it if you want extra details
                                    { label: "Account Status", value: manager.isBlocked ? "Suspended" : "Active" },
                                ]}
                            />
                        </div>

                        {/* 3. Stats Section */}
                        <div className="p-6 sm:p-8 bg-muted/5 border-t border-border">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-1 h-5 bg-secondary rounded-full" />
                                <h3 className="text-lg font-semibold text-foreground">
                                    Performance Metrics
                                </h3>
                            </div>
                            <ManagerStatsSection stats={manager.stats} />
                        </div>

                    </div>
                ) : (
                    !loading && (
                        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl bg-card">
                            <p className="text-muted-foreground text-lg">Manager details not found</p>
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

export default ManagerDetails;