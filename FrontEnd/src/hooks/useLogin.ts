import { useAppDispatch } from "../hooks/hooks";
import { loginUser } from "../features/auth/authThunks";
import type { LoginRequest } from "../types/api/UserApi";
import { UserRole } from "../types/UserRoles";
import { useState } from "react";
import { validateLogin } from "../validators/LoginValidators";

type ValidationErrors = Partial<Record<keyof LoginRequest | "global", string>>;
type LoginSuccess = { success: true; message: string; role: UserRole };
type LoginFailure = { success: false; errors: ValidationErrors };
type LoginResult = LoginSuccess | LoginFailure;

export const useLogin = () => {
    const dispatch = useAppDispatch();

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

    const [formData, setFormData] = useState<LoginRequest>({ email: "", password: "" });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);

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

    return { handleSubmit, handleFieldChange, errors, loading, formData };
};
