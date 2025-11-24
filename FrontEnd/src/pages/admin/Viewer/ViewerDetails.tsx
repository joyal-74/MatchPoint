import { useEffect, useState } from 'react';
import AdminLayout from '../../layout/AdminLayout';
import { useAppDispatch } from '../../../hooks/hooks';
import { useParams } from 'react-router-dom';
import { fetchViewerDetails, userBlockStatus } from '../../../features/admin/users';
import LoadingOverlay from '../../../components/shared/LoadingOverlay';
import type { UserDetails } from '../../../features/admin/users/userTypes';
import UserHeader from '../../../components/admin/details/UserHeader';
import InfoGrid from '../../../components/admin/details/InfoGrid';
import SectionDivider from '../../../components/ui/SectionDivider';

const ViewerDetails = () => {
    const [viewer, setViewer] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();
    const { id } = useParams();

    useEffect(() => {
        const getViewerDetails = async () => {
            if (id) {
                try {
                    setLoading(true);
                    const result = await dispatch(fetchViewerDetails(id)).unwrap();
                    setViewer(result);
                } catch (error) {
                    console.error("Failed to fetch Viewer details:", error);
                    setViewer(null);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setViewer(null);
            }
        };

        getViewerDetails();

        return () => { setViewer(null); };
    }, [dispatch, id]);

    const blockUser = async () => {
        if (!viewer) return;

        const previousState = viewer.isBlocked;
        setViewer({ ...viewer, isBlocked: !viewer.isBlocked });

        try {
            await dispatch(
                userBlockStatus({ userId: viewer._id, isActive: !viewer.isBlocked }));
        } catch (error) {
            console.error("Failed to update user block status:", error);
            setViewer({ ...viewer, isBlocked: previousState });
        }
    };

    return (
        <AdminLayout>
            <LoadingOverlay show={loading} />

            {!loading && viewer && (
                <div className="text-neutral-100 mt-10">
                    <div className="max-w-6xl mx-auto bg-neutral-800 rounded-2xl shadow-2xl p-6 border border-neutral-700">
                        <UserHeader user={viewer} onToggleBlock={blockUser} />

                        <SectionDivider />

                        <InfoGrid
                            data={[
                                { label: "Full Name", value: viewer.fullName, color: "emerald" },
                                { label: "Username", value: `@${viewer.username}`, color: "blue" },
                                { label: "Email", value: viewer.email, color: "purple" },
                                { label: "Phone", value: viewer.phone, color: "red" },
                                { label: "Status", value: viewer.status, color: "emerald" },
                                { label: "Subscription", value: viewer.subscription, color: "emerald" },
                            ]}
                        />
                        <SectionDivider />
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ViewerDetails;