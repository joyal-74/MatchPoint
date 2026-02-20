import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import toast from "react-hot-toast";

import { loginUser, loginUserGoogle, loginUserFacebook } from "../features/auth/authThunks";
import { validateLogin } from "../validators/LoginValidators";
import type { LoginRequest } from "../types/api/UserApi";
import type { LoginSocialResult, LoginUser } from "../types/User";

type LoginResponse = LoginUser | LoginSocialResult;

export const useLogin = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState<LoginRequest>({ email: "", password: "" });
    const [errors, setErrors] = useState<Partial<LoginRequest> & { global?: string }>({});
    const [loading, setLoading] = useState(false);

    const handleFieldChange = (field: keyof LoginRequest, value: string) => {
        const updatedData = { ...formData, [field]: value };
        setFormData(updatedData);

        const validationErrors = validateLogin(updatedData);
        setErrors((prev) => {
            const newErrors = { ...prev };
            if (!validationErrors[field]) delete newErrors[field];
            else newErrors[field] = validationErrors[field];
            if (newErrors.global) delete newErrors.global;
            return newErrors;
        });
    };

    const handleAuthSuccess = (payload: LoginResponse, socialProvider?: string) => {
        if (payload?.tempToken) {
            toast("Account not found. Let's get you set up!");
            navigate("/signup");
            return;
        }

        toast.success(socialProvider ? `${socialProvider} login successful!` : "Login successful!");
        navigate("/dashboard");
    };

    const handleLoginSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setErrors({});

        const validationErrors = validateLogin(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fill in your credentials correctly.");
            return;
        }

        setLoading(true);
        try {
            const result = await dispatch(loginUser(formData)).unwrap();
            handleAuthSuccess(result);
        } catch (err: any) {
            const backendError = typeof err === "string" ? err : "Login failed";
            toast.error(backendError);
            setErrors({ global: backendError });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (token: string) => {
        setLoading(true);
        try {
            const result = await dispatch(loginUserGoogle(token)).unwrap();
            handleAuthSuccess(result, "Google");
        } catch (err: any) {
            toast.error(typeof err === "string" ? err : "Google login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleFacebookLogin = async (token: string) => {
        setLoading(true);
        try {
            const result = await dispatch(loginUserFacebook(token)).unwrap();
            handleAuthSuccess(result, "Facebook");
        } catch (err: any) {
            toast.error(typeof err === "string" ? err : "Facebook login failed");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        errors,
        loading,
        handleFieldChange,
        handleLoginSubmit,
        handleGoogleLogin,
        handleFacebookLogin,
    };
};