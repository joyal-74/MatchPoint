import React from "react";
import { Edit2, Save, X, Loader2, UserCog } from "lucide-react";
import ProfileHeader from "../../components/shared/ProfileHeader";
import ProfileForm from "../../components/shared/ProfileForm";
import PremiumCard from "../../components/shared/PremiumCard";
import ManagerLayout from "../layout/ManagerLayout";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import ProfileError from "../../components/manager/profile/ProfileError";
import { useProfile } from "../../hooks/manager/useProfile";

const ProfilePage: React.FC = () => {
    const {
        isEditing, setIsEditing, profileImage, formData,
        loading, error, handleImageUpload, handleInputChange,
        handleSave, handleCancel, handleRetry
    } = useProfile();

    if (loading && !formData) return <ManagerLayout><LoadingOverlay show={true} /></ManagerLayout>;
    if (error) return <ProfileError error={error} onAction={handleRetry} />;
    if (!formData) return <ManagerLayout><div>No profile data found.</div></ManagerLayout>;

    return (
        <ManagerLayout>
            <div className="max-w-7xl mx-auto mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <ProfileHeader
                            profileData={formData}
                            profileImage={profileImage || formData.profileImage}
                            isEditing={isEditing}
                            onEditToggle={() => setIsEditing((prev) => !prev)}
                            onImageUpload={handleImageUpload}
                        />
                        <PremiumCard />
                    </div>

                    {/* Right Content */}
                    <div className="lg:col-span-2">
                        <div className={`
                            bg-card border rounded-xl shadow-sm overflow-hidden transition-colors duration-300
                            ${isEditing ? 'border-primary/50 ring-1 ring-primary/10' : 'border-border'}
                        `}>
                            
                            {/* --- THE NEW HEADER BAR --- */}
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
                    </div>
                    
                </div>
            </div>
        </ManagerLayout>
    );
};

export default ProfilePage;