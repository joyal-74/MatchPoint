import { useAppDispatch } from "../store/hooks";
import { loginAdmin } from "../store/slices/auth"; 
import type { LoginRequest } from "../../shared/types/api/UserApi";

type ValidationErrors = Partial<Record<keyof LoginRequest | "global", string>>;

export const useLoginAdmin = () => {
    const dispatch = useAppDispatch();


    const validateForm = (payload: LoginRequest): ValidationErrors => {
        const errors: ValidationErrors = {};

        if (!payload.email || !payload.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors.email = "Invalid email address";
        }

        if (!payload.password) errors.password = "Password is required";
        else if (payload.password.length < 6) errors.password = "Password must be 6+ characters";

        return errors;
    };

    const handleLogin = async (payload: LoginRequest) => {
        const errors = validateForm(payload);
        if (Object.keys(errors).length > 0) return { success: false, errors };

        try {
            const resultAction = await dispatch(loginAdmin(payload));
            console.log(resultAction)

            if (loginAdmin.fulfilled.match(resultAction)) {
                return { success: true, message: "Login successful!" };
            } else {
                const backendError = resultAction.payload || "Login failed";
                return { success: false, errors: { global: backendError } };
            }
        } catch (err) {
            console.error(err);
            return { success: false, errors: { global: "Something went wrong" } };
        }
    };

    return { handleLogin };
};
