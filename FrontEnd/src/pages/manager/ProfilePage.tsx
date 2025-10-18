import ProfileHeader from "../../components/shared/ProfileHeader";
import ProfileForm from "../../components/shared/ProfileForm";
import ProfileActions from "../../components/shared/ProfileActions";
import PremiumCard from "../../components/shared/PremiumCard";
import ManagerLayout from "../layout/ManagerLayout";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import ProfileError from "../../components/manager/profile/ProfileError";
import { useProfile } from "../../hooks/manager/useProfile";

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
            <ManagerLayout>
                <div className="min-h-40 flex items-center justify-center text-[var(--color-text-secondary)]">
                    No profile data found.
                </div>
            </ManagerLayout>
        );
    }

    return (
        <ManagerLayout>
            <div className="min-h-40 bg-[var(--color-background)] max-w-6xl rounded-xl">
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
        </ManagerLayout>
    );
};

export default ProfilePage;