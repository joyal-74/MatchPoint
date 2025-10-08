import { useState } from "react";
import ProfileHeader from "../shared/ProfileHeader";
import ProfileForm from "../shared/ProfileForm";
import ProfileActions from "../shared/ProfileActions";
import type { UserProfile } from '../../types/Profile'
import PremiumCard from "../shared/PremiumCard";
import ManagerLayout from "../../pages/layout/ManagerLayout";

const ProfilePage: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<UserProfile>({
        firstName: "Joyal",
        lastName: "Kuriakose",
        username: "joyal74",
        phone: "+91 9745918046",
        email: "joyalkuriakose7@gmail.com",
        gender: "Male",
        bio: "Sports Enthusiastic",
        location: "Kochi, Kerala",
        country: "India",
    });

    const [formData, setFormData] = useState<UserProfile>({ ...profileData });

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
        <ManagerLayout>
            <div className="min-h-40 bg-[var(--color-background)] w-6xl rounded-xl">
                <ProfileHeader
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
        </ManagerLayout>
    );
};

export default ProfilePage;