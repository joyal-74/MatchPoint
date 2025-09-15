import { useAppDispatch } from "../store/hooks";
import { signupUser } from "../store/slices/auth";
import type { UserRegister } from "../../shared/types/api/UserApi";
import { UserRole } from "../../core/domain/types/UserRoles";

type ValidationErrors = Partial<Record<keyof UserRegister | "confirmPassword" | "global", string>>;

export const useSignup = () => {
    const dispatch = useAppDispatch();

    const validateForm = (payload: UserRegister, confirmPassword: string): ValidationErrors => {
        const errors: ValidationErrors = {};

        if (!payload.first_name.trim()) errors.first_name = "First name is required";
        if (!payload.last_name.trim()) errors.last_name = "Last name is required";
        if (!payload.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
            errors.email = "Invalid email address";
        if (!payload.phone.match(/^\d{10}$/))
            errors.phone = "Phone must be 10 digits";
        if (!payload.gender) errors.gender = "Gender is required";
        if (!payload.password) errors.password = "Password is required";
        else if (payload.password.length < 6) errors.password = "Password must be 6+ characters";
        if (payload.password !== confirmPassword)
            errors.confirmPassword = "Passwords do not match";
        if (payload.role === UserRole.Player && !payload.sport) {
            errors.sport = "Sport is required for players";
        }

        return errors;
    };

    const handleSignup = async (payload: UserRegister, confirmPassword: string) => {
        const errors = validateForm(payload, confirmPassword);
        if (Object.keys(errors).length > 0) return { success: false, errors };

        try {
            const resultAction = await dispatch(signupUser(payload));

            if (signupUser.fulfilled.match(resultAction)) {
                return { success: true, message: "Signup successful! Verify your account via email.", 
                    expiresAt: resultAction.payload.expiresAt, email: payload.email };
            } else {
                const backendError = resultAction.payload || "Signup failed";
                return { success: false, errors: { global: backendError } };
            }
        } catch (err) {
            console.error(err);
            return { success: false, errors: { global: "Something went wrong" } };
        }
    };

    return { handleSignup };
};
