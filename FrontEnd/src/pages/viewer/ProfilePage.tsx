import ProfileHeader from "../../components/shared/ProfileHeader";
import ProfileForm from "../../components/shared/ProfileForm";
import ProfileActions from "../../components/shared/ProfileActions";
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


    if (loading && !formData) <LoadingOverlay show={loading} />

    if (error) <ProfileError error={error} onAction={handleRetry} />

    if (!formData) {
        return (
            <ViewerProfileLayout>
                <div className="min-h-40 flex items-center justify-center text-[var(--color-text-secondary)]">
                    No profile data found.
                </div>
            </ViewerProfileLayout>
        );
    }

    return (
        <ViewerProfileLayout>
            <div className="min-h-40 bg-[var(--color-background)] w-6xl rounded-xl">
                <ProfileHeader
                    profileData={formData}
                    profileImage={profileImage || formData.profileImage}
                    isEditing={isEditing}
                    onEditToggle={() => setIsEditing((prev) => !prev)}
                    onImageUpload={handleImageUpload}
                />

                <div className="py-8">
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto"></div>
                            <p className="mt-2 text-[var(--color-text-secondary)]">
                                Updating...
                            </p>
                        </div>
                    ) : (
                        <>
                            <ProfileForm
                                formData={formData}
                                isEditing={isEditing}
                                onChange={handleInputChange}
                            />

                            {isEditing && (
                                <ProfileActions onSave={handleSave} onCancel={handleCancel} />
                            )}

                            {!isEditing && (
                                <div className="mt-8 mx-8">
                                    <PremiumCard />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </ViewerProfileLayout>
    );
};

export default ProfilePage;