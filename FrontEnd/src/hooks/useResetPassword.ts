import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { resetPassword } from "../features/auth/authThunks";
import { clearResetEmail } from "../features/auth/authSlice";
import { useState } from "react";

type ValidationErrors = { password?: string; confirmPassword?: string; global?: string };
type ResetPayload = { password: string; confirmPassword: string };
type ResetResult =
    | { success: true; message: string }
    | { success: false; errors: ValidationErrors };

export const useResetPassword = () => {
    const dispatch = useAppDispatch();
    const email = useAppSelector((state) => state.auth.resetEmail);

    const [formData, setFormData] = useState<ResetPayload>({ password: "", confirmPassword: "" });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);

    const validateForm = (payload: ResetPayload): ValidationErrors => {
        const errors: ValidationErrors = {};
        if (!payload.password) errors.password = "Password is required";
        else if (payload.password.length < 6) errors.password = "Password must be at least 6 characters";
        if (payload.password !== payload.confirmPassword) errors.confirmPassword = "Passwords do not match";
        return errors;
    };

    const handleReset = async (payload: ResetPayload): Promise<ResetResult> => {
        if (!email) return { success: false, errors: { global: "Email is missing" } };

        try {
            const resultAction = await dispatch(resetPassword({ email, newPassword: payload.password }));
            if (resetPassword.fulfilled.match(resultAction)) {
                dispatch(clearResetEmail());
                return { success: true, message: "Password has been successfully changed" };
            } else {
                return { success: false, errors: { global: (resultAction.payload as string) || "Reset failed" } };
            }
        } catch {
            return { success: false, errors: { global: "Something went wrong" } };
        }
    };

    const handleFieldChange = (field: keyof ResetPayload, value: string) => {
        setFormData({ ...formData, [field]: value });
        const fieldError = validateForm({ ...formData, [field]: value })[field];
        setErrors((prev) => ({ ...prev, [field]: fieldError }));
    };

    const handleSubmit = async (): Promise<ResetResult> => {
        setErrors({});
        setLoading(true);

        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return { success: false, errors: validationErrors };
        }

        const result = await handleReset(formData);
        setLoading(false);

        if (!result.success && result.errors?.global) {
            setErrors(result.errors);
        }

        return result;
    };

    return { formData, errors, loading, handleFieldChange, handleSubmit };
};