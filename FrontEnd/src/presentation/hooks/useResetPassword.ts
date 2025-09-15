import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearResetEmail } from "../store/slices/auth";
import { resetPassword } from "../store/slices/auth/authThunks";

type ValidationErrors = { password?: string; confirmPassword?: string; global?: string };
type ResetPayload = { password: string; confirmPassword: string };
type ResetResult =
    | { success: true; message: string }
    | { success: false; errors: ValidationErrors };

export const useResetPassword = () => {
    const dispatch = useAppDispatch();

    const email = useAppSelector((state) => state.auth.resetEmail);
    console.log(email)

    const validateForm = (payload: ResetPayload): ValidationErrors => {
        const errors: ValidationErrors = {};
        if (!payload.password) errors.password = "Password is required";
        else if (payload.password.length < 6)
            errors.password = "Password must be at least 6 characters";

        if (payload.password !== payload.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        return errors;
    };

    const handleResetPassword = async (payload: ResetPayload): Promise<ResetResult> => {
        const errors = validateForm(payload);
        if (Object.keys(errors).length > 0) {
            return { success: false, errors };
        }

        if (!email) {
            return { success: false, errors: { global: "Email is missing" } };
        }

        try {
            const resultAction = await dispatch(resetPassword({ email, newPassword: payload.password }));
            if (resetPassword.fulfilled.match(resultAction)) {
                dispatch(clearResetEmail());
                return { success: true, message: "Password has successfully changed" };
            } else {
                return {
                    success: false,
                    errors: { global: (resultAction.payload as string) || "Reset failed" },
                };
            }
        } catch {
            return { success: false, errors: { global: "Something went wrong" } };
        }
    };

    return { handleResetPassword };
};