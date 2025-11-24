import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../hooks/hooks';
import type { ManagerDetails } from '../../../features/admin/users/userTypes';
import { useParams } from 'react-router-dom';
import { fetchManagerDetails, userBlockStatus } from '../../../features/admin/users';
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
        setManager({ ...manager, isBlocked: !manager.isBlocked });

        try {
            await dispatch(
                userBlockStatus({ userId: manager._id, isActive: !manager.isBlocked }));
        } catch (error) {
            console.error("Failed to update user block status:", error);
            setManager({ ...manager, isBlocked: previousState });
        }
    };

    return (
        <AdminLayout>
            <LoadingOverlay show={loading} />
            {!loading && manager && (
                <div className="text-neutral-100 mt-10">
                    <div className="max-w-6xl mx-auto bg-neutral-800 rounded-2xl shadow-2xl p-6 border border-neutral-700">
                        <UserHeader user={manager} onToggleBlock={blockUser} />
                        <div className="border-t border-neutral-700 mb-6"></div>
                        <InfoGrid
                            data={[
                                { label: "Full Name", value: manager.fullName, color: "emerald" },
                                { label: "Username", value: `@${manager.username}`, color: "blue" },
                                { label: "Email", value: manager.email, color: "purple" },
                                { label: "Phone", value: manager.phone, color: "red" },
                                { label: "Status", value: manager.status, color: "emerald" },
                                { label: "Subscription", value: manager.subscription, color: "emerald" },
                            ]}
                        />
                        <div className="border-t border-neutral-700 my-6"></div>
                        <ManagerStatsSection stats={manager.stats} />
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ManagerDetails;