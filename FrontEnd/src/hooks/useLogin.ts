import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import toast from "react-hot-toast";

import type { PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { loginUser, loginUserGoogle, loginUserFacebook, loginUserSocialComplete } from "../features/auth/authThunks";
import { clearAuthProvider, clearTempToken } from "../features/auth/authSlice";

import { validateLogin } from "../validators/LoginValidators";
import type { LoginRequest, CompleteUserData } from "../types/api/UserApi";
import type { LoginSocialResult } from "../types/User";


type AuthAction = PayloadAction<
    LoginSocialResult | string | undefined,
    string,
    { requestStatus: "fulfilled" | "rejected" },
    SerializedError
>;

export const useLogin = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { tempToken, authProvider } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState<LoginRequest>({ email: "", password: "" });

    const [errors, setErrors] = useState<Partial<LoginRequest> & { global?: string }>({});
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [registrationLoading, setRegistrationLoading] = useState(false);

    useEffect(() => {
        if (tempToken) setShowModal(true);
    }, [tempToken]);

    const handleFieldChange = (field: keyof LoginRequest, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const processLoginResult = (resultAction: AuthAction, socialProvider?: string) => {
        if (resultAction.meta.requestStatus === 'fulfilled') {
            const payload = resultAction.payload as LoginSocialResult;

            if (payload?.tempToken) {
                return;
            }

            toast.success(socialProvider ? `${socialProvider} login successful!` : "Login successful!");
            navigate("/dashboard");
        } else {
            const backendError = (resultAction.payload as string) || "Login failed";

            toast.error(backendError);
            setErrors({ global: backendError });
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const validationErrors = validateLogin(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        const result = await dispatch(loginUser(formData)) as unknown as AuthAction;
        setLoading(false);

        processLoginResult(result);
    };

    const handleGoogleLogin = async (token: string) => {
        setLoading(true);
        const result = await dispatch(loginUserGoogle(token)) as unknown as AuthAction;
        setLoading(false);
        processLoginResult(result, "Google");
    };

    const handleFacebookLogin = async (token: string) => {
        setLoading(true);
        const result = await dispatch(loginUserFacebook(token)) as unknown as AuthAction;
        setLoading(false);
        processLoginResult(result, "Facebook");
    };

    const closeRegistrationModal = () => {
        setShowModal(false);
        dispatch(clearAuthProvider());
        dispatch(clearTempToken());
    };

    const handleFinalRegistration = async (userData: CompleteUserData) => {
        if (!tempToken) return;

        setRegistrationLoading(true);
        const resultAction = await dispatch(loginUserSocialComplete({ ...userData, tempToken }));
        setRegistrationLoading(false);

        if (resultAction.meta.requestStatus === 'fulfilled') {
            toast.success("Registration completed successfully!");
            setShowModal(false);
            navigate("/dashboard");
        } else {
            const errorMsg = (resultAction.payload as string) || "Registration failed";
            toast.error(errorMsg);
        }
    };

    return {
        formData,
        errors,
        loading,
        showModal,
        tempToken,
        authProvider,
        registrationLoading,
        handleFieldChange,
        handleLoginSubmit,
        handleGoogleLogin,
        handleFacebookLogin,
        closeRegistrationModal,
        handleFinalRegistration
    };
};