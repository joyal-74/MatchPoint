import { useAppDispatch } from "../store/hooks";
import { signupUser } from "../store/slices/auth";
import type { UserRegister } from "../../shared/types/api/UserApi";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../core/domain/types/UserRoles";

type ValidationErrors = Partial<Record<keyof UserRegister | "confirmPassword", string>>;

export const useSignup = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

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
        if (payload.password.length < 6)
            errors.password = "Password must be 6+ char";
        if (payload.password !== confirmPassword)
            errors.confirmPassword = "Passwords do not match";
        if (payload.role === UserRole.Player && !payload.sport) {
            errors.sport = "Sport is required for players";
        }

        return errors;
    };

    const handleSignup = async (payload: UserRegister, confirmPassword: string) => {
        const errors = validateForm(payload, confirmPassword);
        if (Object.keys(errors).length > 0) {
            return { success: false, errors };
        }

        try {
            const resultAction = await dispatch(signupUser(payload));
            if (signupUser.fulfilled.match(resultAction)) {
                navigate("/email-verify");
                return { success: true };
            } else {
                return { success: false, errors: { global: resultAction.payload || "Signup failed" } };
            }
        } catch (err) {
            console.error(err);
            return { success: false, errors: { global: "Something went wrong" } };
        }
    };

    return { handleSignup };
};
