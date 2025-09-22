import { useAppDispatch } from "../hooks/hooks";
import { loginAdmin } from "../features/auth/authThunks";
import type { LoginRequest } from "../types/api/UserApi";
import { validateLogin } from "../validators/LoginValidators";
import { useState } from "react";
import { getApiErrorMessage } from "../utils/apiError";

type ValidationErrors = Partial<Record<keyof LoginRequest | "global", string>>;

export const useLoginAdmin = () => {
    const dispatch = useAppDispatch();


    const validateForm = (payload: LoginRequest): ValidationErrors => {
        return validateLogin(payload);
    };

    const handleLogin = async (payload: LoginRequest) => {
        const errors = validateForm(payload);
        if (Object.keys(errors).length > 0) return { success: false, errors };

        try {
            const resultAction = await dispatch(loginAdmin(payload));

            if (loginAdmin.fulfilled.match(resultAction)) {
                return { success: true, message: "Login successful!" };
            } else {
                const backendError = resultAction.payload || "Login failed";
                return { success: false, errors: { global: backendError } };
            }
        } catch (err) {
            console.error(err);
            return { success: false, errors: { global: getApiErrorMessage(err) || "Something went wrong" } };
        }
    };


    const [formData, setFormData] = useState<LoginRequest>({ email: "", password: "" });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);

    const handleFieldChange = (field: keyof LoginRequest, value: string) => {
        setFormData({ ...formData, [field]: value });

        const fieldError = validateLogin({ ...formData, [field]: value })[field];
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: fieldError,
        }));
    };

    const handleSubmit = async () => {
        setErrors({});
        setLoading(true);

        const validationErrors = validateLogin(formData);
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

    return { handleSubmit, handleFieldChange, errors, loading, formData };
};