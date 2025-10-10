import ProfileHeader from "../../shared/ProfileHeader";
import ProfileForm from "../../shared/ProfileForm";
import ProfileActions from "../../shared/ProfileActions";
import PremiumCard from "../../shared/PremiumCard";
import LoadingOverlay from "../../shared/LoadingOverlay";
import ProfileError from "./ProfileError";
import { useProfile } from "../../../hooks/manager/useProfile";
import PlayerLayout from "../../../pages/layout/PlayerLayout";

const PlayerProfilePage: React.FC = () => {
    const {
        isEditing, setIsEditing, profileImage, formData, loading, error, handleImageUpload,
        handleInputChange, handleSave, handleCancel, handleRetry
    } = useProfile();


    if (loading && !formData) <LoadingOverlay show={loading} />

    if (error) <ProfileError error={error} onAction={handleRetry} />

    if (!formData) {
        return (
            <PlayerLayout>
                <div className="min-h-60 flex items-center justify-center text-[var(--color-text-secondary)]">
                    No profile data found.
                </div>
            </PlayerLayout>
        );
    }

    return (
        <PlayerLayout>
            <div className="min-h-40 bg-[var(--color-background)] min-w-5xl rounded-xl">
                <ProfileHeader
                    profileData={formData}
                    profileImage={profileImage || formData.profileImage}
                    isEditing={isEditing}
                    onEditToggle={() => setIsEditing((prev) => !prev)}
                    onImageUpload={handleImageUpload}
                />

                <div className="py-6">
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
                                <div className="mt-6 mx-8">
                                    <PremiumCard />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </PlayerLayout>
    );
};

export default PlayerProfilePage;