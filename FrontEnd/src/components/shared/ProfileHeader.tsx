import { Camera, Edit } from "lucide-react";

interface ProfileHeaderProps {
    profileData: { firstName: string; lastName: string; username: string; profileImage?: string };
    profileImage: string | null;
    isEditing: boolean;
    onEditToggle: () => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    profileData,
    profileImage,
    isEditing,
    onEditToggle,
    onImageUpload
}) => (
    <div className="relative h-28 mt-8 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 overflow-hidden rounded-t-xl">
        <div className="absolute inset-0 bg-[var(--color-primary)]/30 rounded-t-xl"></div>
        <div className="relative z-10 flex items-end h-full py-3 px-10">
            <div className="flex items-end gap-6">
                {/* Profile Picture */}
                <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-xl">
                        {profileImage || profileData.profileImage ? (
                            <img
                                src={profileImage || profileData.profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                <span className="text-white text-xl font-semibold">
                                    {`${profileData.firstName[0]}${profileData.lastName[0]}`}
                                </span>
                            </div>
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                        <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
                    </label>
                </div>

                {/* Profile Info */}
                <div className="text-white mb-2">
                    <div className="text-sm opacity-75 mb-1">@{profileData.username}</div>
                    <h1 className="text-lg font-semibold">{`${profileData.firstName} ${profileData.lastName}`}</h1>
                </div>
            </div>

            <div className="ml-auto mb-2">
                <button
                    onClick={onEditToggle}
                    className="flex items-center gap-2 px-4 py-2 text-[var(--color-text-primary)] hover:text-emerald-300 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all text-sm font-medium"
                >
                    <Edit className="w-4 h-4" />
                    {isEditing ? "Cancel" : "Update"}
                </button>
            </div>
        </div>
    </div>
);

export default ProfileHeader;