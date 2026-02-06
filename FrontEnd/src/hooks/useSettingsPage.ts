import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAppDispatch, useAppSelector } from "./hooks";
import { invalidatePasswordVerification, resetSettingsState } from "../features/shared/settings/settingsSlice";
import { updatePassword, updatePrivacySettings, verifyCurrentPassword } from "../features/shared/settings/settingsThunk";


// Utility for password strength
const calculateStrength = (password: string) => {
    let score = 0;
    if (!password) return 0;
    if (password.length > 8) score += 1;
    if (password.match(/[A-Z]/)) score += 1;
    if (password.match(/[0-9]/)) score += 1;
    if (password.match(/[^A-Za-z0-9]/)) score += 1;
    return score;
};

export const useSettingsPage = () => {
    const dispatch = useAppDispatch();
    const { theme, setTheme, color, setColor } = useTheme();

    // Redux State
    const {
        isLoading, isVerifying, isPasswordVerified,
        error: reduxError, successMessage
    } = useAppSelector((state) => state.settings);

    const user = useAppSelector(state => state.auth.user);
    const userId = user?._id

    // Local State
    const [expandedSection, setExpandedSection] = useState<string | null>('appearance');
    const [security, setSecurity] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
    const [preferences, setPreferences] = useState({
        language: user?.settings.language || "en",
        country: user?.settings.country || "IN"
    });

    // Cleanup Effect
    useEffect(() => {
        return () => { dispatch(resetSettingsState()); }
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setPreferences({
                language: user.settings.language || "en",
                country: user.settings.country || "IN"
            });
        }
    }, [user]);

    // Computed Properties
    const passwordScore = calculateStrength(security.newPassword);

    // Handlers
    const handleSecurityChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSecurity(prev => ({ ...prev, [name]: value }));

        if (name === 'currentPassword') {
            dispatch(invalidatePasswordVerification());
        }
    }, [dispatch]);

    const handlePreferenceChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPreferences(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleCurrentPasswordBlur = useCallback(() => {
        if (security.currentPassword.length > 0 && userId) {
            dispatch(verifyCurrentPassword({ userId, password: security.currentPassword }));
        }
    }, [security.currentPassword, userId, dispatch]);

    const toggleVisibility = useCallback((field: keyof typeof showPassword) => {
        setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
    }, []);

    const toggleSection = useCallback((section: string) => {
        setExpandedSection(prev => prev === section ? null : section);
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) return;

        if (expandedSection === 'security') {
            if (!isPasswordVerified) return;

            if (security.newPassword !== security.confirmPassword) {
                alert("New passwords do not match."); // Ideally use a toast here
                return;
            }

            const res = await dispatch(updatePassword({
                userId,
                currentPassword: security.currentPassword,
                newPassword: security.newPassword
            }));

            if (res.meta.requestStatus === 'fulfilled') {
                setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        }
        else if (expandedSection === 'preferences') {
            dispatch(updatePrivacySettings({
                userId,
                language: preferences.language,
                country: preferences.country
            }));
        }
    };

    return {
        // Data
        theme, color,
        security, preferences, showPassword,
        expandedSection, passwordScore,

        // UI State
        isLoading, isVerifying, isPasswordVerified,
        reduxError, successMessage,

        // Actions
        setTheme, setColor,
        handleSecurityChange,
        handlePreferenceChange,
        handleCurrentPasswordBlur,
        toggleVisibility,
        toggleSection,
        handleSave
    };
};