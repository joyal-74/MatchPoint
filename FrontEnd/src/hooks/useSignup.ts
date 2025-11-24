import { useState } from "react";
import { useAppDispatch } from "../hooks/hooks";
import { loginUserGoogle, signupUser } from "../features/auth/authThunks";
import { UserRole, type Gender } from "../types/UserRoles";
import { validateSignup } from "../validators/SignpValidators";
import type { SignUpForm } from "../utils/helpers/SignupFields";

type ValidationErrors = Partial<Record<keyof SignUpForm | "global", string>>;

export const useSignup = () => {
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState<SignUpForm>({
        firstName: "",
        lastName: "",
        email: "",
        phone: '',
        gender: "male" as Gender,
        password: "",
        confirmPassword: "",
        role: UserRole.Player,
        sport: "",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);

    const validateForm = (payload: SignUpForm): ValidationErrors => {
        return validateSignup(payload);
    };

    const handleFieldChange = (field: keyof SignUpForm, value: string) => {
        setFormData({ ...formData, [field]: value });

        const fieldError = validateForm({ ...formData, [field]: value })[field];
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: fieldError,
        }));
    };

    const handleConfirmPasswordChange = (value: string) => {
        setConfirmPassword(value);
        const confirmError = formData.password !== value ? "Passwords do not match" : undefined;
        setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    };

    const handleSubmit = async () => {
        setErrors({});
        setLoading(true);

        const validationErrors = validateForm(formData);
        console.log(validationErrors, "validationErrors")
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return { success: false, errors: validationErrors };
        }

        try {
            const resultAction = await dispatch(signupUser(formData));

            setLoading(false);

            if (signupUser.fulfilled.match(resultAction)) {
                return {
                    success: true,
                    message: "Signup successful! Verify your account via email.",
                    expiresAt: resultAction.payload.expiresAt,
                    email: formData.email,
                };
            } else {
                const backendError = resultAction.payload || "Signup failed";
                return { success: false, errors: { global: backendError } };
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
            return { success: false, errors: { global: "Something went wrong" } };
        }
    };

    const handleGoogleSignUp = async (token: string) => {
        setLoading(true);
        try {
            const resultAction = await dispatch(loginUserGoogle({ token }));

            if (loginUserGoogle.fulfilled.match(resultAction)) {
                const role: UserRole = resultAction.payload.role;
                setLoading(false);
                return { success: true, message: "Google signup successful!", role };
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

    return {
        formData,
        confirmPassword,
        setFormData,
        handleFieldChange,
        handleConfirmPasswordChange,
        handleSubmit,
        handleGoogleSignUp,
        errors,
        loading,
    };
};