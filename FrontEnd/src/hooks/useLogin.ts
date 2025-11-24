import { useAppDispatch } from "../hooks/hooks";
import { loginUser, loginUserFacebook, loginUserGoogle, loginUserSocialComplete } from "../features/auth/authThunks";
import type { CompleteUserData, LoginRequest } from "../types/api/UserApi";
import { UserRole } from "../types/UserRoles";
import { useState } from "react";
import { validateLogin } from "../validators/LoginValidators";
import type { LoginSocialResult } from "../types/User";
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

    const handleGoogleLogin = async (code: string): Promise<LoginSocialResult> => {
        setLoading(true);
        try {
            const resultAction = await dispatch(loginUserGoogle(code));
            if (loginUserGoogle.fulfilled.match(resultAction)) {
                const payload = resultAction.payload;
                setLoading(false);
                return {
                    success: true,
                    message: payload.tempToken ? "Please complete your registration" : "Google login successful!",
                    tempToken: payload.tempToken,
                    authProvider: payload.authProvider,
                    user: payload.user
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

    const handleFacebookLogin = async (code: string): Promise<LoginSocialResult> => {
        setLoading(true);
        try {
            const resultAction = await dispatch(loginUserFacebook(code));
            if (loginUserFacebook.fulfilled.match(resultAction)) {
                const payload = resultAction.payload;
                setLoading(false);
                return {
                    success: true,
                    message: payload.tempToken ? "Please complete your registration" : "Facebook login successful!",
                    tempToken: payload.tempToken,
                    authProvider: payload.authProvider,
                    user: payload.user
                };
            } else {
                const backendError = resultAction.payload || "Facebook login failed";
                setLoading(false);
                return { success: false, errors: { global: backendError } };
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
            return { success: false, errors: { global: "Something went wrong" } };
        }
    };


    const handleRegistrationSubmit = async (userData: CompleteUserData) => {
        try {
            const resultAction = await dispatch(loginUserSocialComplete(userData));
            if (loginUserSocialComplete.fulfilled.match(resultAction)) {
                toast.success("Registration completed successfully!");
                navigate('/dashboard');
                return { success: true };
            } else {
                const error = resultAction.payload || "Registration failed";
                toast.error(error);
                return { success: false, error };
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
            return { success: false, error: "Something went wrong" };
        }
    };

    return {
        handleSubmit,
        handleGoogleLogin,
        handleFacebookLogin,
        handleFieldChange,
        errors,
        loading,
        formData,
        handleRegistrationSubmit,
    };
};