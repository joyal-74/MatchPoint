import React from "react";
import {
    Edit2, Save, X, Loader2, UserCog,
    LogOut, Settings, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../../components/shared/ProfileHeader";
import ProfileForm from "../../components/shared/ProfileForm";
import PremiumCard from "../../components/shared/PremiumCard";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import ProfileError from "../../components/manager/profile/ProfileError";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logoutUser } from "../../features/auth";
import UmpireProfileLayout from "../layout/UmpireLayout";
import { useUmpireProfile } from "../../hooks/umpire/useUmpireProfile";

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(s => s.auth.user);

    const {
        isEditing, setIsEditing, profileImage, formData,
        loading, error, handleImageUpload, handleInputChange,
        handleSave, handleCancel, handleRetry
    } = useUmpireProfile();

    // --- Logout Logic ---
    const handleLogout = async () => {
        try {
            await dispatch(logoutUser({ userId: user?._id, role: user?.role })).unwrap();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (loading && !formData) return <UmpireProfileLayout><LoadingOverlay show={true} /></UmpireProfileLayout>;
    if (error) return <ProfileError error={error} onAction={handleRetry} />;
    if (!formData) return <UmpireProfileLayout><div>No profile data found.</div></UmpireProfileLayout>;

    return (
        <UmpireProfileLayout>
            <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <ProfileHeader
                            user={user}
                            profileData={formData}
                            profileImage={profileImage || formData.profileImage}
                            isEditing={isEditing}
                            onEditToggle={() => setIsEditing((prev) => !prev)}
                            onImageUpload={handleImageUpload}
                        />
                        {/* Hide Premium Card on mobile, show at bottom instead */}
                        <div className="hidden lg:block">
                            <PremiumCard />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className={`
                            bg-card border rounded-xl shadow-sm overflow-hidden transition-colors duration-300
                            ${isEditing ? 'border-primary/50 ring-1 ring-primary/10' : 'border-border'}
                        `}>

                            {/* Header Bar */}
                            <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                        <UserCog size={20} className="text-primary" />
                                        Personal Information
                                    </h2>
                                    <p className="text-xs text-muted-foreground hidden sm:block">
                                        Manage your personal details and contact preferences.
                                    </p>
                                </div>

                                {/* Action Buttons Area */}
                                <div className="flex items-center gap-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                onClick={handleCancel}
                                                disabled={loading}
                                                className="p-2 sm:px-3 sm:py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
                                                title="Cancel"
                                            >
                                                <X size={16} /> <span className="hidden sm:inline">Cancel</span>
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                disabled={loading}
                                                className="px-4 py-1.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-all shadow-sm flex items-center gap-2"
                                            >
                                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                                <span>Save</span>
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-1.5 text-sm font-medium text-foreground bg-background border border-border hover:bg-muted rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                                        >
                                            <Edit2 size={14} />
                                            <span>Edit Details</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Form Body */}
                            <div className="p-6">
                                <ProfileForm
                                    formData={formData}
                                    isEditing={isEditing}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* --- Mobile Only: Account Actions --- */}
                        <div className="md:hidden space-y-4 pt-4 border-t border-border">
                            <h3 className="text-sm font-semibold text-muted-foreground px-1">Account</h3>

                            <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border shadow-sm">
                                <button
                                    onClick={() => navigate('/manager/settings')}
                                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                                            <Settings size={18} />
                                        </div>
                                        <span className="font-medium text-sm">Settings</span>
                                    </div>
                                    <ChevronRight size={16} className="text-muted-foreground" />
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-between p-4 hover:bg-red-50 hover:text-red-600 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-muted rounded-full group-hover:bg-red-100 transition-colors">
                                            <LogOut size={18} />
                                        </div>
                                        <span className="font-medium text-sm">Logout</span>
                                    </div>
                                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-red-400" />
                                </button>
                            </div>

                            <div className="pt-2">
                                <PremiumCard />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </UmpireProfileLayout>
    );
};

export default ProfilePage;