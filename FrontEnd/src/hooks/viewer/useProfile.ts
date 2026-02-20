import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import type { RootState } from "../../app/store";
import type { UserProfile } from "../../types/Profile";
import { fetchViewerData, updateViewerData } from "../../features/viewer/viewerThunks";
import toast from "react-hot-toast";
import { validateProfile } from "../../validators/ProfileValidator";

export const useProfile = () => {
    const dispatch = useAppDispatch();
    const { viewer, loading } = useAppSelector((state: RootState) => state.viewer);
    const user = useAppSelector((state: RootState) => state.auth.user);
    const viewerId = user?._id

    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<UserProfile | null>(null);

    // Fetch viewer data
    useEffect(() => {
        if (viewerId) {
            dispatch(fetchViewerData(viewerId));
        }
    }, [dispatch, viewerId]);


    useEffect(() => {
        if (viewer) {
            setFormData(viewer);
            setProfileImage(viewer.profileImage || null);
        }
    }, [viewer]);

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

    const handleSave = async () => {
        if (!formData || !viewerId) return;

        const validationErrors = validateProfile(formData, "user");

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fix the errors in the form.");
            return;
        }
        
        const data = new FormData();

        for (const [key, value] of Object.entries(formData)) {
            data.append(key, value ?? "");
        }

        if (selectedFile) {
            data.append("file", selectedFile);
        }

        try {
            await dispatch(updateViewerData({ userData: data, userId: viewerId })).unwrap();
            toast.success("Profile updated successfully!");
            setIsEditing(false);
            setSelectedFile(null);
        } catch (err) {
            console.error("Profile update failed:", err);
            toast.error("Failed to update profile. Please try again.");
        }
    };

    const handleCancel = () => {
        if (viewer) {
            setFormData(viewer);
            setProfileImage(viewer.profileImage || null);
            setSelectedFile(null);
        }
        setIsEditing(false);
    };

    const handleRetry = () => {
        if (viewerId) dispatch(fetchViewerData(viewerId));
    };

    return {
        user,
        isEditing,
        setIsEditing,
        profileImage,
        formData,
        loading,
        errors,
        handleImageUpload,
        handleInputChange,
        handleSave,
        handleCancel,
        handleRetry,
    };
};