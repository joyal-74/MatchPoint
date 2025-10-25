import { useAppDispatch } from "../hooks/hooks";
import { loginUser, loginUserGoogle, loginUserGoogleComplete } from "../features/auth/authThunks";
import type { CompleteUserData, LoginRequest } from "../types/api/UserApi";
import { UserRole } from "../types/UserRoles";
import { useState } from "react";
import { validateLogin } from "../validators/LoginValidators";
import type { LoginGoogleResult } from "../types/User";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type ValidationErrors = Partial<Record<keyof LoginRequest | "global", string>>;
type LoginSuccess = { success: true; message: string; role: UserRole };
type LoginFailure = { success: false; errors: ValidationErrors };
type LoginResult = LoginSuccess | LoginFailure;

export const useLogin = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<LoginRequest>({ email: "", password: "" });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);

    // Modal state
    const [showRegistrationModal, setShowRegistrationModal] = useState(false);
    const [tempToken, setTempToken] = useState<string>('');
    const [registrationLoading, setRegistrationLoading] = useState(false);

    const validateForm = (payload: LoginRequest): ValidationErrors => {
        return validateLogin(payload);
    };

    const handleLogin = async (payload: LoginRequest): Promise<LoginResult> => {
        const errors = validateForm(payload);
        if (Object.keys(errors).length > 0) return { success: false, errors };

        try {
            const resultAction = await dispatch(loginUser(payload));

            if (loginUser.fulfilled.match(resultAction)) {
                const role: UserRole = resultAction.payload.role;
                return { success: true, message: "Login successful!", role };
            } else {
                const backendError = resultAction.payload || "Login failed";
                return { success: false, errors: { global: backendError } };
            }
        } catch (err) {
            console.error(err);
            return { success: false, errors: { global: "Something went wrong" } };
        }
    };

    const handleFieldChange = (field: keyof LoginRequest, value: string) => {
        setFormData({ ...formData, [field]: value });

        const fieldError = validateForm({ ...formData, [field]: value })[field];
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: fieldError,
        }));
    };

    const handleSubmit = async (): Promise<LoginResult> => {
        setErrors({});
        setLoading(true);

        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return { success: false, errors: validationErrors };
        }

        const result = await handleLogin(formData);
        setLoading(false);

        if (!result.success && result.errors?.global) {
            setErrors(result.errors);
        }

        return result;
    };

    const handleGoogleLogin = async (code: string): Promise<LoginGoogleResult> => {
        setLoading(true);
        try {
            const resultAction = await dispatch(loginUserGoogle(code));

            if (loginUserGoogle.fulfilled.match(resultAction)) {
                const payload = resultAction.payload;

                if (payload.tempToken) {
                    setTempToken(payload.tempToken);
                    setShowRegistrationModal(true);
                    setLoading(false);
                    return {
                        success: true,
                        message: "Please complete your registration",
                        tempToken: payload.tempToken
                    };
                }

                if (payload.user && payload.accessToken) {
                    setLoading(false);
                    return {
                        success: true,
                        message: "Google login successful!",
                        user: payload.user,
                    };
                }

                setLoading(false);
                return {
                    success: false,
                    errors: { global: "Unexpected response from server" }
                };
            } else {
                const backendError = resultAction.payload || "Google login failed";
                setLoading(false);
                return { success: false, errors: { global: backendError } };
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
            return { success: false, errors: { global: "Something went wrong" } };
        }
    };

    const handleRegistrationSubmit = async (userData : CompleteUserData) => {
        setRegistrationLoading(true);

        const response = await dispatch(loginUserGoogleComplete(userData));

        if (response) {
            setShowRegistrationModal(false);
            setTempToken('');

            toast.success("Registration completed successfully!");
            navigate('/dashboard');
        }
        setRegistrationLoading(false);
    };

    const closeRegistrationModal = () => {
        setShowRegistrationModal(false);
        setTempToken('');
    };

    return {
        handleSubmit,
        handleGoogleLogin,
        handleFieldChange,
        errors,
        loading,
        formData,
        showRegistrationModal,
        tempToken,
        handleRegistrationSubmit,
        registrationLoading,
        closeRegistrationModal,
    };
};