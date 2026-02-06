import React, { useState } from "react";
import { Edit2, Save, Loader2, LogOut, Settings, User, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../../components/shared/ProfileHeader";
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
        isEditing, setIsEditing, profileImage, formData, playerProfile,
        loading, error, handleImageUpload, handleInputChange,
        handlePlayerProfileChange, handleSave, handleCancel, handleRetry
    } = useProfile();

    const [activeTab, setActiveTab] = useState<"user" | "sport">("user");

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser({ userId: user?._id, role: user?.role })).unwrap();
            navigate("/login");
        } catch (error) { console.error("Logout failed", error); }
    };

    if (loading && !formData) return <PlayerLayout><LoadingOverlay show={true} /></PlayerLayout>;
    if (error) return <ProfileError error={error} onAction={handleRetry} />;
    if (!formData || !playerProfile) return null;

    return (
        <PlayerLayout>
            <div className="mx-auto w-full">
                {/* Reduced gap for mobile, larger for desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    
                    {/* LEFT SIDE */}
                    <div className="lg:col-span-4 space-y-6">
                        <ProfileHeader
                            user={user}
                            profileData={formData}
                            profileImage={profileImage || formData.profileImage}
                            isEditing={isEditing}
                            onEditToggle={() => setIsEditing(!isEditing)}
                            onImageUpload={handleImageUpload}
                        />
                        
                        {/* Desktop Actions */}
                        <div className="hidden lg:block bg-card border border-border rounded-2xl p-2 shadow-sm">
                            <button onClick={() => navigate('/player/settings')} className="flex items-center gap-3 w-full p-3 text-sm font-medium hover:bg-muted rounded-xl transition-all">
                                <Settings size={18} /> Settings
                            </button>
                            <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-sm font-medium hover:bg-destructive/10 rounded-xl transition-all text-destructive">
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="lg:col-span-8">
                        <div className="bg-card border border-border rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden flex flex-col">
                            
                            <div className="px-5 pt-6 border-b border-border">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight">
                                            {activeTab === 'user' ? "Personal Profile" : "Athletic Details"}
                                        </h2>
                                        <p className="text-xs text-muted-foreground">Manage your identity and performance stats.</p>
                                    </div>

                                    {/* Action Buttons: Full width on mobile */}
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        {isEditing ? (
                                            <>
                                                <button onClick={handleCancel} className="flex-1 sm:px-4 py-2 text-sm font-medium border border-border rounded-xl hover:bg-muted">
                                                    Cancel
                                                </button>
                                                <button onClick={() => handleSave(activeTab)} disabled={loading} className="flex-1 sm:px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-xl flex items-center justify-center gap-2">
                                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => setIsEditing(true)} className="flex-1 sm:w-auto px-6 py-2 text-sm font-bold bg-secondary text-secondary-foreground rounded-xl flex items-center justify-center gap-2">
                                                <Edit2 size={16} /> Edit Profile
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Custom Tab Switcher: Scrollable on mobile if tabs grow */}
                                <div className="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
                                    <button 
                                        onClick={() => setActiveTab("user")}
                                        className={`pb-4 text-sm font-semibold transition-all relative whitespace-nowrap ${activeTab === 'user' ? 'text-primary' : 'text-muted-foreground'}`}
                                    >
                                        <div className="flex items-center gap-2"><User size={16}/> Basic Info</div>
                                        {activeTab === 'user' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab("sport")}
                                        className={`pb-4 text-sm font-semibold transition-all relative whitespace-nowrap ${activeTab === 'sport' ? 'text-primary' : 'text-muted-foreground'}`}
                                    >
                                        <div className="flex items-center gap-2"><Trophy size={16}/> Sports Stats</div>
                                        {activeTab === 'sport' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                                    </button>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="p-5 sm:p-8">
                                <div className="max-w-3xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-2">
                                    {activeTab === "user" ? (
                                        <ProfileForm isEditing={isEditing} formData={formData} onChange={handleInputChange} />
                                    ) : (
                                        <SportsProfileForm isEditing={isEditing} formData={playerProfile} onChange={handlePlayerProfileChange} />
                                    )}
                                </div>
                            </div>

                            {/* Mobile-only Footer */}
                            <div className="lg:hidden p-4 bg-muted/20 border-t border-border grid grid-cols-2 gap-3">
                                <button onClick={() => navigate('/player/settings')} className="py-3 text-xs font-bold bg-card border border-border rounded-xl flex items-center justify-center gap-2">
                                    <Settings size={14}/> Settings
                                </button>
                                <button onClick={handleLogout} className="py-3 text-xs font-bold text-destructive bg-destructive/10 rounded-xl flex items-center justify-center gap-2">
                                    <LogOut size={14}/> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PlayerLayout>
    );
};

export default PlayerProfilePage;