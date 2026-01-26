import React from "react";
import { Edit2, Save, X, Loader2, UserCog } from "lucide-react";
import ProfileHeader from "../../components/shared/ProfileHeader";
import ProfileForm from "../../components/shared/ProfileForm";
import PremiumCard from "../../components/shared/PremiumCard";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import ProfileError from "../../components/viewer/profile/ProfileError";
import ViewerProfileLayout from "../layout/ViewerProfileLayout";
import { useProfile } from "../../hooks/viewer/useProfile";

const ProfilePage: React.FC = () => {
    const {
        isEditing,
        setIsEditing,
        profileImage,
        formData,
        loading,
        error,
        handleImageUpload,
        handleInputChange,
        handleSave,
        handleCancel,
        handleRetry
    } = useProfile();

    // 1. Consistent Loading/Error states matching the source layout
    if (loading && !formData) return <ViewerProfileLayout><LoadingOverlay show={true} /></ViewerProfileLayout>;
    if (error) return <ProfileError error={error} onAction={handleRetry} />;
    
    // Fallback if data is missing
    if (!formData) {
        return (
            <ViewerProfileLayout>
                <div className="min-h-[40vh] flex items-center justify-center text-muted-foreground">
                    No profile data found.
                </div>
            </ViewerProfileLayout>
        );
    }

    return (
        <ViewerProfileLayout>
            <div className="mx-auto mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* --- Left Sidebar (Header + Premium) --- */}
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

                    {/* --- Right Content (Form Area) --- */}
                    <div className="lg:col-span-2">
                        <div className={`
                            bg-card border rounded-xl shadow-sm overflow-hidden transition-colors duration-300
                            ${isEditing ? 'border-primary/50 ring-1 ring-primary/10' : 'border-border'}
                        `}>
                            
                            {/* Sticky Header with Title & Action Buttons */}
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

                                {/* Action Buttons (Moved from bottom to Header) */}
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
        </ViewerProfileLayout>
    );
};

export default ProfilePage;