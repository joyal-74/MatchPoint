import { useEffect, useState } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { useAppDispatch } from '../../../hooks/hooks';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchViewerDetails, userBlockStatus } from '../../../features/admin/users';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import LoadingOverlay from '../../../components/shared/LoadingOverlay';
import type { UserDetails } from '../../../features/admin/users/userTypes';
import UserHeader from '../../../components/admin/details/UserHeader';
import InfoGrid from '../../../components/admin/details/InfoGrid';

const ViewerDetails = () => {
    const [viewer, setViewer] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getViewerDetails = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const result = await dispatch(fetchViewerDetails(id)).unwrap();
                setViewer(result);
            } catch (error) {
                console.error("Failed to fetch Viewer details:", error);
                toast.error("Could not load viewer details");
                setViewer(null);
            } finally {
                setLoading(false);
            }
        };

        getViewerDetails();
        return () => { setViewer(null); };
    }, [dispatch, id]);

    const blockUser = async () => {
        if (!viewer) return;

        const previousState = viewer.isBlocked;
        
        // Optimistic UI Update
        setViewer({ ...viewer, isBlocked: !viewer.isBlocked });

        try {
            await dispatch(
                userBlockStatus({ userId: viewer._id, isActive: !viewer.isBlocked })
            );
            toast.success(viewer.isBlocked ? "User unblocked successfully" : "User blocked successfully");
        } catch (error) {
            console.error("Failed to update user block status:", error);
            // Revert state
            setViewer({ ...viewer, isBlocked: previousState });
            toast.error("Failed to update block status");
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
                    <span>Back to Viewers</span>
                </button>

                {!loading && viewer ? (
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* 1. Header Section */}
                        <div className="p-6 sm:p-8 border-b border-border bg-muted/20">
                            <UserHeader user={viewer} onToggleBlock={blockUser} />
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
                                    { label: "Full Name", value: viewer.fullName },
                                    { label: "Username", value: `@${viewer.username}` },
                                    { label: "Email", value: viewer.email },
                                    { label: "Phone", value: viewer.phone || "N/A" },
                                    { label: "Account Status", value: viewer.isBlocked ? "Suspended" : "Active" },
                                    { label: "Subscription", value: viewer.subscription || "Free Tier" },
                                ]}
                            />
                        </div>
                        
                        {/* Viewers typically don't have stats, but if they do, add Section 3 here */}

                    </div>
                ) : (
                    !loading && (
                        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl bg-card">
                            <p className="text-muted-foreground text-lg">Viewer details not found</p>
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

export default ViewerDetails;