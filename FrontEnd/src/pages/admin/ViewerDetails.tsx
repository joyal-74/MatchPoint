import { useEffect, useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { useAppDispatch } from '../../hooks/hooks';
import { useParams } from 'react-router-dom';
import { fetchViewerDetails } from '../../features/admin/users';
import LoadingOverlay from '../../components/shared/LoadingOverlay';
import type { viewerDetails } from '../../features/admin/users/userTypes';

const sampleViewer: viewerDetails = {
    _id: "67498f2c2f93a92c12345678",
    fullName: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    role: "Viewer",
    status: "Active",
    subscription: "Free",
    joinedAt: "March 12, 2023",
    profileImage: "https://via.placeholder.com/150",
    isBlocked: false,
};

const ViewerDetails = () => {
    const [viewer, setViewer] = useState<viewerDetails>(sampleViewer);
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
                    setViewer(sampleViewer);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setViewer(sampleViewer);
            }
        };

        getViewerDetails();

        return () => {
            setViewer(sampleViewer);
        };
    }, [dispatch, id]);

    // Icon definitions for different fields
    const getFieldIcon = (label: string) => {
        switch (label) {
            case "Full Name":
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            case "Username":
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                );
            case "Email":
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                );
            case "Phone":
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                );
            case "Status":
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case "Subscription":
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
        }
    };

    return (
        <AdminLayout>
            <LoadingOverlay show={loading} />

            {!loading && viewer && (
                <div className="text-neutral-100 mt-10">
                    <div className="max-w-6xl mx-auto bg-neutral-800 rounded-2xl shadow-2xl p-6 border border-neutral-700">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
                            <div className="relative">
                                <img
                                    src={viewer.profileImage || '/office-worker.png'}
                                    alt="Viewer Profile"
                                    className="w-25 h-25 rounded-full shadow-lg"
                                />
                            </div>

                            <div className="text-center sm:text-left flex-1">
                                <h1 className="text-2xl font-bold text-emerald-400 mb-1">
                                    {viewer.fullName}
                                </h1>
                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                    <span className="px-2 py-1 bg-neutral-700 rounded-full text-xs font-medium text-neutral-300">
                                        {viewer.role}
                                    </span>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium border ${viewer.isBlocked
                                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                            }`}
                                    >
                                        {viewer.isBlocked ? "Blocked" : "Active"}
                                    </span>
                                </div>
                                <p className="text-neutral-400 text-sm flex items-center justify-center sm:justify-start gap-1">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Joined: {viewer.joinedAt}
                                </p>
                            </div>

                            <button
                                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 text-sm ${viewer.isBlocked
                                        ? "bg-emerald-500 hover:bg-emerald-600"
                                        : "bg-red-500 hover:bg-red-600"
                                    }`}
                            >
                                {viewer.isBlocked ? "Unblock" : "Block"}
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-neutral-700 mb-6"></div>

                        {/* Viewer Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
                            {[
                                { label: "Full Name", value: viewer.fullName, color: "emerald" },
                                { label: "Username", value: `@${viewer.username}`, color: "blue" },
                                { label: "Email", value: viewer.email, color: "purple" },
                                { label: "Phone", value: viewer.phone, color: "red" },
                                { label: "Status", value: viewer.status, color: "emerald" },
                                { label: "Subscription", value: viewer.subscription, color: "emerald" },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-neutral-700/30 rounded-lg p-3 border border-neutral-600/50 hover:border-emerald-500/30 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-8 h-8 bg-${item.color}-500/20 rounded-full flex items-center justify-center`}
                                        >
                                            {getFieldIcon(item.label)}
                                        </div>
                                        <div>
                                            <h2 className="text-xs uppercase text-neutral-400 font-semibold">
                                                {item.label}
                                            </h2>
                                            <p className="text-base font-semibold text-neutral-100">
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-neutral-700 my-6"></div>

                        
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ViewerDetails;