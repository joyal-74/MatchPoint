import { useAppDispatch } from "../hooks/hooks";
import { requestResetOtp } from "../features/auth";
import { useState } from "react";
import { getApiErrorMessage } from "../utils/apiError";
import { validateEmail } from "../validators/EmailValidator";

type ForgotPasswordPayload = {
    email: string;
};

type ForgotPasswordResult = {
    success: boolean;
    message?: string;
    errors?: ValidationErrors;
    expiresAt?: string;
    email?: string;
};

type ValidationErrors = Partial<
    Record<keyof ForgotPasswordPayload | "global", string>
>;

export const useForgotPassword = () => {
    const dispatch = useAppDispatch();

    const validateForm = (payload: ForgotPasswordPayload): ValidationErrors => {
        return validateEmail(payload);
    };

    const handleForgotPassword = async (
        payload: ForgotPasswordPayload
    ): Promise<ForgotPasswordResult> => {
        const errors = validateForm(payload);
        if (Object.keys(errors).length > 0) return { success: false, errors };

        try {
            const resultAction = await dispatch(requestResetOtp(payload.email));
            console.log(resultAction);

            if (requestResetOtp.fulfilled.match(resultAction)) {
                return {
                    success: true,
                    message: "OTP sent to your email",
                    expiresAt: resultAction.payload.expiresAt,
                    email: payload.email,
                };
            } else {
                const backendError = resultAction.payload || "Failed to send OTP";
                return { success: false, errors: { global: backendError } };
            }
        } catch (err) {
            console.error(err);
            return {
                success: false,
                errors: { global: getApiErrorMessage(err) || "Something went wrong" },
            };
        }
    };

    const [formData, setFormData] = useState<ForgotPasswordPayload>({ email: "", });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);

    const handleFieldChange = (field: keyof ForgotPasswordPayload, value: string) => {
        setFormData({ ...formData, [field]: value });
        const fieldError = validateForm({ ...formData, [field]: value })[field];
        setErrors((prev) => ({ ...prev, [field]: fieldError }));
    };

    const handleSubmit = async () => {
        setErrors({});
        setLoading(true);

        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return { success: false, errors: validationErrors };
        }

        const result = await handleForgotPassword(formData);
        setLoading(false);

        if (!result.success && result.errors?.global) {
            setErrors(result.errors);
        }

        return result;
    };

    return { handleSubmit, handleFieldChange, errors, loading, formData };
};