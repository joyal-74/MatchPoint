import { useState } from "react";
import ProfileHeader from "../../components/shared/ProfileHeader";
import ProfileActions from "../../components/shared/ProfileActions";
import PremiumCard from "../../components/shared/PremiumCard";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import ProfileError from "../../components/player/profile/ProfileError";
import PlayerLayout from "../layout/PlayerLayout";
import ProfileForm from "../../components/player/profile/ProfileForm";
import SportsProfileForm from "../../components/player/profile/SportsProfileForm";
import { useProfile } from "../../hooks/player/useProfile";

const PlayerProfilePage: React.FC = () => {
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

    if (loading && !formData) return <LoadingOverlay show={loading} />;

    if (error) return <ProfileError error={error} onAction={handleRetry} />;

    if (!formData || !playerProfile) {
        return (
            <PlayerLayout>
                <div className="min-h-60 flex items-center justify-center text-[var(--color-text-secondary)]">
                    No profile data found.
                </div>
            </PlayerLayout>
        );
    }

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
        profile : playerProfile.profile
    };

    return (
        <PlayerLayout>
            <div className="min-h-40 bg-[var(--color-background)] max-w-6xl rounded-xl">
                <ProfileHeader
                    profileData={formData}
                    profileImage={profileImage || formData.profileImage}
                    isEditing={isEditing}
                    onEditToggle={() => setIsEditing((prev) => !prev)}
                    onImageUpload={handleImageUpload}
                />

                <div className="py-6">
                    {loading ? <LoadingOverlay show={loading} /> : (
                        <>
                            <div className="flex gap-4 items-center justify-end pr-8">
                                <button
                                    className={activeTab === "user" ? "font-bold text-purple-700" : ""}
                                    onClick={() => setActiveTab("user")}
                                >
                                    User Info
                                </button>
                                <button
                                    className={activeTab === "sport" ? "font-bold text-purple-700" : ""}
                                    onClick={() => setActiveTab("sport")}
                                >
                                    Sport Info
                                </button>
                            </div>

                            {activeTab === "user" && (
                                <ProfileForm
                                    isEditing={isEditing}
                                    formData={userProfile}
                                    onChange={(field, value) => handleInputChange(field, value)}
                                />
                            )}

                            {activeTab === "sport" && (
                                <SportsProfileForm
                                    isEditing={isEditing}
                                    formData={playerProfileData}
                                    onChange={(field, val) => handlePlayerProfileChange(field, val)}

                                />
                            )}

                            {isEditing && (
                                <ProfileActions onSave={() => handleSave(activeTab)} onCancel={handleCancel} />
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