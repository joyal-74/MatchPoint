import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { loginUser } from "../store/slices/auth";
import type { LoginRequest } from "../../shared/types/api/UserApi";
import { UserRole } from "../../core/domain/types/UserRoles";

type ValidationErrors = Partial<Record<keyof LoginRequest, string>> & { global?: string };

export const useLogin = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const validateForm = (payload: LoginRequest): ValidationErrors => {
        const errors: ValidationErrors = {};

        if (!payload.email || !payload.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors.email = "Invalid email address";
        }

        if (!payload.password) {
            errors.password = "Password is required";
        } else if (payload.password.length < 6) {
            errors.password = "Password must be 6+ characters";
        }

        return errors;
    };

    const handleLogin = async (payload: LoginRequest) => {
        const errors = validateForm(payload);
        if (Object.keys(errors).length > 0) {
            return { success: false, errors };
        }

        try {
            const resultAction = await dispatch(loginUser(payload));

            if (loginUser.fulfilled.match(resultAction)) {
                const role: UserRole = resultAction.payload.role;

                if (role === UserRole.Manager) {
                    navigate("/manager/dashboard");
                } else if (role === UserRole.Viewer) {
                    navigate("/");
                } else {
                    navigate("/login");
                }

                return { success: true };
            } else {
                return { success: false, errors: { global: resultAction.payload || "Login failed" } };
            }
        } catch (err) {
            console.error(err);
            return { success: false, errors: { global: "Something went wrong" } };
        }
    };

    return { handleLogin };
};
