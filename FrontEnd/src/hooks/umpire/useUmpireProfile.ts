import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import type { RootState } from "../../app/store";
import type { UserProfile } from "../../types/Profile";
import { fetchUmpireData, updateUmpireData } from "../../features/umpire/umpireThunks";
import { toast } from "react-toastify";

export const useUmpireProfile = () => {
    const dispatch = useAppDispatch();
    const { umpire, loading, error } = useAppSelector((state: RootState) => state.umpire);
    const umpireId = useAppSelector((state: RootState) => state.auth.user?._id);

    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<UserProfile | null>(null);

    // Fetch umpire data
    useEffect(() => {
        if (umpireId) {
            dispatch(fetchUmpireData(umpireId));
        }
    }, [dispatch, umpireId]);


    useEffect(() => {
        if (umpire) {
            setFormData(umpire);
            setProfileImage(umpire.profileImage || null);
        }
    }, [umpire]);

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

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleSave = async () => {
        if (!formData || !umpireId) return;
        const data = new FormData();

        for (const [key, value] of Object.entries(formData)) {
            data.append(key, value ?? "");
        }

        if (selectedFile) {
            data.append("file", selectedFile);
        }

        try {
            await dispatch(updateUmpireData({ userData: data, userId: umpireId })).unwrap();
            toast.success("Profile updated successfully!");
            setIsEditing(false);
            setSelectedFile(null);
        } catch (err) {
            console.error("Profile update failed:", err);
            toast.error("Failed to update profile. Please try again.");
        }
    };

    const handleCancel = () => {
        if (umpire) {
            setFormData(umpire);
            setProfileImage(umpire.profileImage || null);
            setSelectedFile(null);
        }
        setIsEditing(false);
    };

    const handleRetry = () => {
        if (umpireId) dispatch(fetchUmpireData(umpireId));
    };

    return {
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
        handleRetry,
    };
};