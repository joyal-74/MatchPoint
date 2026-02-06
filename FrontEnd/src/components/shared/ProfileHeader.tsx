import React from "react";
import { Camera, Edit2, Mail, MapPin, Calendar, X } from "lucide-react";
import type { AuthUser } from "../../types/User";

interface ProfileHeaderProps {
    user: AuthUser | null,
    profileData: { firstName: string; lastName: string; username: string; profileImage?: string; email?: string };
    profileImage: string | null;
    isEditing: boolean;
    onEditToggle: () => void;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return "Recently Joined";
    const date = new Date(dateInput);
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, profileData, profileImage, isEditing, onEditToggle, onImageUpload }) => {
    console.log(user, 'profileData')
    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden group">

            <div className="h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-background relative">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />

                <button
                    onClick={onEditToggle}
                    className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all${isEditing
                        ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                        : 'bg-background/50 hover:bg-background text-foreground'
                        }
                    `}
                >
                    {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                </button>
            </div>

            <div className="px-6 pb-6 relative">
                {/* Avatar - Negative Margin to overlap banner */}
                <div className="-mt-16 mb-4 relative inline-block">
                    <div className="w-32 h-32 rounded-full border-4 border-card bg-muted flex items-center justify-center overflow-hidden shadow-xl">
                        {profileImage || profileData.profileImage ? (
                            <img
                                src={profileImage || profileData.profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-4xl font-bold text-muted-foreground">
                                {(profileData?.firstName?.[0] || '') + (profileData?.lastName?.[0] || '') || '?'}
                            </div>
                        )}
                    </div>

                    {isEditing && (
                        <label className="absolute bottom-1 right-1 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer shadow-lg hover:bg-primary/90 transition-colors">
                            <Camera size={16} />
                            <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
                        </label>
                    )}
                </div>

                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground">
                        {profileData.firstName} {profileData.lastName}
                    </h1>
                    <p className="text-primary font-medium">@{profileData.username}</p>
                </div>

                <div className="mt-6 space-y-3 pt-6 border-t border-border">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Mail size={16} />
                        <span className="truncate">{profileData.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <MapPin size={16} />
                        <span>Kerala, India</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Calendar size={16} />
                        <span>Joined {formatDate(user?.createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;