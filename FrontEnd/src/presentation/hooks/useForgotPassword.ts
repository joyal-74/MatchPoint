import { useAppDispatch } from "../store/hooks";
import { requestResetOtp } from "../store/slices/auth";

type ForgotPasswordPayload = {
    email: string;
};

type ForgotPasswordResult =
    | { success: true; message: string; expiresAt: string; email: string }
    | { success: false; errors: ValidationErrors };

type ValidationErrors = Partial<Record<keyof ForgotPasswordPayload | "global", string>>;

export const useForgotPassword = () => {
    const dispatch = useAppDispatch();

    const validateForm = (payload: ForgotPasswordPayload): ValidationErrors => {
        const errors: ValidationErrors = {};

        if (!payload.email) {
            errors.email = "Email is required";
        } else if (!payload.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors.email = "Invalid email address";
        }

        return errors;
    };

    const forgotPassword = async ( email: string): Promise<ForgotPasswordResult> => {
        const payload = { email };
        const errors = validateForm(payload);

        if (Object.keys(errors).length > 0) {
            return { success: false, errors };
        }

        try {
            const resultAction = await dispatch(requestResetOtp(email));
            console.log(resultAction);

            if (requestResetOtp.fulfilled.match(resultAction)) {
                return { success: true, message: "OTP sent to your email", expiresAt: resultAction.payload.expiresAt, email };
            } else {
                const errorMessage = (resultAction.payload as string) || "Failed to send OTP";
                return { success: false, errors: { global: errorMessage } };
            }
        } catch (err) {
            console.error(err);
            return { success: false, errors: { global: "Something went wrong" } };
        }
    };

    return { forgotPassword };
};