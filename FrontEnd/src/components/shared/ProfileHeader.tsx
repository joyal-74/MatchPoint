import { Camera, Edit } from "lucide-react";

interface ProfileHeaderProps {
    profileData: { firstName: string; lastName: string; username: string; profileImage?: string };
    profileImage: string | null;
    isEditing: boolean;
    onEditToggle: () => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profileData, profileImage, isEditing, onEditToggle, onImageUpload }) => {
    return (
        <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden rounded-t-2xl shadow-2xl mt-8">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse-slow"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

            <div className="relative z-10 p-3 px-8">
                <div className="flex items-end justify-between">
                    <div className="flex items-end gap-6">
                        <div
                            className="relative">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl transition-all duration-300 hover:border-white/40 hover:scale-105 group">
                                {profileImage || profileData.profileImage ? (
                                    <img
                                        src={profileImage || profileData.profileImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                                        <span className="text-white text-xl font-bold">
                                            {`${profileData.firstName[0]}${profileData.lastName[0]}`}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {isEditing && (
                                <label className={`absolute bottom-1 right-1 w-8 h-8 bg-gradient-to-r from-purple-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 rounded-xl flex items-center justify-center cursor-pointer shadow-lg border-2 border-white/20 transition-all duration-300`}>
                                    <Camera className="w-4 h-4 text-white" />
                                    <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
                                </label>
                            )}
                        </div>

                        <div className="text-white mb-2 space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                    {`${profileData.firstName} ${profileData.lastName}`}
                                </h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                    @{profileData.username || 'user'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-2">
                        <button
                            onClick={onEditToggle}
                            className={`flex items-center gap-3 px-6 py-2.5 text-sm rounded-xl font-semibold transition-all duration-300 transform hover:scale-101 shadow-lg backdrop-blur-sm border ${isEditing
                                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30'
                                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                                }`}
                        >
                            <Edit className="w-4 h-4" /> {isEditing ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;