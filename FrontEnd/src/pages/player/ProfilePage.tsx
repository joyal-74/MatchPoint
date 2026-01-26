import React, { useState } from "react";
import { 
    Edit2, Save, X, Loader2, User, Trophy, Activity, 
    LogOut, Settings, ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../../components/shared/ProfileHeader";
import PremiumCard from "../../components/shared/PremiumCard";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import ProfileError from "../../components/player/profile/ProfileError";
import PlayerLayout from "../layout/PlayerLayout";
import ProfileForm from "../../components/player/profile/ProfileForm";
import SportsProfileForm from "../../components/player/profile/SportsProfileForm";
import { useProfile } from "../../hooks/player/useProfile";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logoutUser } from "../../features/auth";

const PlayerProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(s => s.auth.user);
    
    const {
        isEditing,
        setIsEditing,
        profileImage,
        formData,
        playerProfile,
        loading,
        error,
        handleImageUpload,
        handleInputChange,
        handlePlayerProfileChange,
        handleSave,
        handleCancel,
        handleRetry
    } = useProfile();

    const [activeTab, setActiveTab] = useState<"user" | "sport">("user");

    // --- Logout Logic ---
    const handleLogout = async () => {
        try {
            await dispatch(logoutUser({ userId: user?._id, role: user?.role })).unwrap();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (loading && !formData) return <PlayerLayout><LoadingOverlay show={true} /></PlayerLayout>;
    if (error) return <ProfileError error={error} onAction={handleRetry} />;
    
    if (!formData || !playerProfile) {
        return (
            <PlayerLayout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-muted-foreground">
                    <Activity size={48} className="mb-4 opacity-20" />
                    <p>No profile data found.</p>
                </div>
            </PlayerLayout>
        );
    }

    // Data prep
    const userProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        bio: formData.bio,
        profileImage: formData.profileImage
    };

    const playerProfileData = {
        sport: playerProfile.sport,
        profile: playerProfile.profile
    };

    return (
        <PlayerLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Sidebar: Photo & Premium */}
                    <div className="lg:col-span-1 space-y-6">
                        <ProfileHeader
                            profileData={formData}
                            profileImage={profileImage || formData.profileImage}
                            isEditing={isEditing}
                            onEditToggle={() => setIsEditing((prev) => !prev)}
                            onImageUpload={handleImageUpload}
                        />
                        <div className="hidden lg:block">
                            <PremiumCard />
                        </div>
                    </div>

                    {/* Right Content: Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className={`
                            bg-card border rounded-xl shadow-sm overflow-hidden transition-all duration-300 flex flex-col min-h-[600px]
                            ${isEditing ? 'border-primary/50 ring-1 ring-primary/10' : 'border-border'}
                        `}>

                            {/* Header: Title & Actions */}
                            <div className="px-6 py-4 border-b border-border bg-muted/20 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                                        {activeTab === 'user' ? (
                                            <><User size={20} className="text-primary" /> Personal Details</>
                                        ) : (
                                            <><Trophy size={20} className="text-primary" /> Sports Profile</>
                                        )}
                                    </h2>
                                    <p className="text-xs text-muted-foreground hidden sm:block">
                                        {activeTab === 'user' 
                                            ? "Manage your contact info and bio." 
                                            : "Update your stats, position, and play style."}
                                    </p>
                                </div>

                                {/* Action Buttons */}
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
                                                onClick={() => handleSave(activeTab)}
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

                            {/* Tab Switcher */}
                            <div className="flex border-b border-border bg-card">
                                <button
                                    onClick={() => setActiveTab("user")}
                                    className={`
                                        flex-1 py-3 text-sm font-medium transition-all relative
                                        ${activeTab === "user" 
                                            ? "text-primary bg-primary/5" 
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        }
                                    `}
                                >
                                    User Info
                                    {activeTab === "user" && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("sport")}
                                    className={`
                                        flex-1 py-3 text-sm font-medium transition-all relative
                                        ${activeTab === "sport" 
                                            ? "text-primary bg-primary/5" 
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        }
                                    `}
                                >
                                    Sports Info
                                    {activeTab === "sport" && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                                    )}
                                </button>
                            </div>

                            {/* Form Body */}
                            <div className="py-6 px-1">
                                {loading ? (
                                    <div className="flex justify-center items-center h-40">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in zoom-in-95 duration-300">
                                        {activeTab === "user" ? (
                                            <ProfileForm
                                                isEditing={isEditing}
                                                formData={userProfile}
                                                onChange={(field, value) => handleInputChange(field, value)}
                                            />
                                        ) : (
                                            <SportsProfileForm
                                                isEditing={isEditing}
                                                formData={playerProfileData}
                                                onChange={(field, val) => handlePlayerProfileChange(field, val)}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="md:hidden space-y-4 pt-4 border-t border-border">
                            <h3 className="text-sm font-semibold text-muted-foreground px-1">Account</h3>
                            
                            <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border shadow-sm">
                                <button 
                                    onClick={() => navigate('/player/settings')}
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
        </PlayerLayout>
    );
};

export default PlayerProfilePage;