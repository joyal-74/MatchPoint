// hooks/useForgotPassword.ts
import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { requestResetOtp } from "../store/slices/auth";
import { useNavigate } from "react-router-dom";

type ForgotPasswordPayload = {
    email: string;
};

type ValidationErrors = Partial<Record<keyof ForgotPasswordPayload, string>>;

type ForgotPasswordResult = {
    success: boolean;
    errors?: ValidationErrors;
    message?: string;
};

export const useForgotPassword = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const validateForm = (payload: ForgotPasswordPayload): ValidationErrors => {
        const errors: ValidationErrors = {};

        if (!payload.email) {
            errors.email = "Email is required";
        } else if (!payload.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors.email = "Invalid email address";
        }

        return errors;
    };

    const forgotPassword = async (email: string): Promise<ForgotPasswordResult> => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const payload = { email };
        const errors = validateForm(payload);

        if (Object.keys(errors).length > 0) {
            setLoading(false);
            return { success: false, errors };
        }

        try {
            const resultAction = await dispatch(requestResetOtp(email));

            if (requestResetOtp.fulfilled.match(resultAction)) {
                setSuccess(true);
                navigate("/otp-verification", { state: { email } });
                return { success: true };
            } else {
                const errorMessage = resultAction.payload as string || "Failed to send OTP";
                setError(errorMessage);
                return {
                    success: false,
                    errors: { email: errorMessage }
                };
            }
        } catch (err) {
            const errorMessage = "Something went wrong";
            setError(errorMessage);
            return {
                success: false,
                errors: { email: errorMessage }
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        forgotPassword,
        loading,
        error,
        success,
        resetState: () => {
            setError(null);
            setSuccess(false);
        }
    };
};