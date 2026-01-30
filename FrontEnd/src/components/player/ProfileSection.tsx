import { useState } from "react";
import ProfileHeader from "../shared/ProfileHeader";
import ProfileForm from "../shared/ProfileForm";
import ProfileActions from "../shared/ProfileActions";
import type { UserProfile } from '../../types/Profile'
import PremiumCard from "../shared/PremiumCard";
import PlayerLayout from "../../pages/layout/PlayerLayout";
import { useAppSelector } from "../../hooks/hooks";

const ProfilePage: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<UserProfile>({
        firstName: "",
        lastName: "",
        profileImage: '',
        username: "",
        phone: "",
        email: "",
        gender: "",
        bio: "",
    });

    const [formData, setFormData] = useState<UserProfile>({ ...profileData });
    const user = useAppSelector((state) => state.auth.user)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setProfileImage(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        setProfileData({ ...profileData, ...formData });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({ ...profileData });
        setIsEditing(false);
    };

    return (
        <PlayerLayout>
            <div className="min-h-40 bg-[var(--color-background)] w-6xl rounded-xl">
                <ProfileHeader
                    user={user}
                    profileData={profileData}
                    profileImage={profileImage}
                    isEditing={isEditing}
                    onEditToggle={() => setIsEditing(!isEditing)}
                    onImageUpload={handleImageUpload}
                />

                <div className="py-8">
                    <ProfileForm formData={formData} isEditing={isEditing} onChange={handleInputChange} />
                    {isEditing ? <ProfileActions onSave={handleSave} onCancel={handleCancel} /> : null}

                    {!isEditing && (
                        <div className="mt-8 max-w-5xl mx-auto">
                            <PremiumCard />
                        </div>
                    )}

                </div>
            </div>
        </PlayerLayout>
    );
};

export default ProfilePage;