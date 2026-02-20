import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import type { RootState } from "../../app/store";
import type { UserProfile } from "../../types/Profile";
import { toast } from "react-toastify";
import { fetchPlayerData, updatePlayerData, updatePlayerProfileData } from "../../features/player/playerThunks";
import { validateProfile } from "../../validators/ProfileValidator";

export const useProfile = () => {
    const dispatch = useAppDispatch();
    const { player, loading } = useAppSelector((state: RootState) => state.player);
    const userId = useAppSelector((state: RootState) => state.auth.user?._id);

    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<UserProfile | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [playerProfile, setPlayerProfile] = useState({
        sport: "",
        profile: {},
    });

    // Fetch player data
    useEffect(() => {
        if (userId) {
            dispatch(fetchPlayerData(userId));
        }
    }, [dispatch, userId]);

    useEffect(() => {
        if (player) {
            const { firstName, lastName, email, username, phone, gender, bio, profileImage, sport } = player;

            setFormData({ firstName, lastName, email, username, phone, gender, bio, profileImage, sport });
            setPlayerProfile({
                sport: sport || "",
                profile: player.profile || {},
            });

            setProfileImage(profileImage || null);
        }
    }, [player]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return;
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = (ev) => {
            const imageUrl = ev.target?.result as string;
            setProfileImage(imageUrl);
        };
        reader.readAsDataURL(file);
    };

    const handleInputChange = useCallback((field: keyof UserProfile, value: string) => {
        setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));

        if (errors[field]) {
            setErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[field];
                return newErrs;
            });
        }
    }, [errors]);


    const handlePlayerProfileChange = (field: string, value: string) => {
        setPlayerProfile((prev) => ({
            ...prev,
            profile: {
                ...prev.profile,
                [field]: value,
            },
        }));
    };


    const appendFormEntries = (data: Record<string, any>) => {
        const form = new FormData();
        Object.entries(data).forEach(([k, v]) => form.append(k, v ?? ""));
        return form;
    };

    const handleSave = async (activeTab: "user" | "sport") => {
        if (!userId) return;

        const dataToValidate = activeTab === "user" ? formData : playerProfile.profile;
        const validationResults = validateProfile(dataToValidate, activeTab);

        if (Object.keys(validationResults).length > 0) {
            setErrors(validationResults);
            toast.error("Please fix the errors in the form.");
            return;
        }

        try {
            if (activeTab === "user" && formData) {
                const userData = appendFormEntries(formData);
                if (selectedFile) userData.append("file", selectedFile);
                await dispatch(updatePlayerData({ userData, userId })).unwrap();
                toast.success("User info updated successfully!");
            }

            if (activeTab === "sport" && playerProfile) {
                const profileData = {
                    sport: playerProfile.sport,
                    ...playerProfile.profile
                };
                await dispatch(updatePlayerProfileData({ userData: profileData, userId })).unwrap();
                toast.success("Sport info updated successfully!");
            }

            setIsEditing(false);
            setSelectedFile(null);
        } catch (err) {
            console.error("Profile update failed:", err);
            toast.error("Failed to update profile. Please try again.");
        }
    };


    const handleCancel = () => {
        if (player) {
            setFormData(player);
            setPlayerProfile({
                sport: player.sport,
                profile: player.profile
            });
            setProfileImage(player.profileImage || null);
            setSelectedFile(null);
        }
        setIsEditing(false);
    };

    const handleRetry = () => {
        if (userId) dispatch(fetchPlayerData(userId));
    };


    return {
        isEditing,
        setIsEditing,
        profileImage,
        formData,
        playerProfile,
        loading,
        errors,
        setErrors,
        handleImageUpload,
        handleInputChange,
        handlePlayerProfileChange,
        handleSave,
        handleCancel,
        handleRetry,
    };
};