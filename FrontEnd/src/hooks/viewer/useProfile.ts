import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import type { RootState } from "../../app/store";
import type { UserProfile } from "../../types/Profile";
import { fetchViewerData, updateViewerData } from "../../features/viewer/viewerThunks";
import toast from "react-hot-toast";

export const useProfile = () => {
    const dispatch = useAppDispatch();
    const { viewer, loading, error } = useAppSelector((state: RootState) => state.viewer);
    const user = useAppSelector((state: RootState) => state.auth.user);
    const viewerId = user?._id


    console.log('viewerId', viewerId)
    console.log('vieer', viewer)

    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleSave = async () => {
        if (!formData || !viewerId) return;
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
        error,
        handleImageUpload,
        handleInputChange,
        handleSave,
        handleCancel,
        handleRetry,
    };
};