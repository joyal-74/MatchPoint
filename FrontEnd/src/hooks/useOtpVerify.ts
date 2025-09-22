import { useAppDispatch } from "../hooks/hooks";
import { verifyOtp, resendOtp } from "../features/auth/authThunks";
import { useState } from "react";
import { getApiErrorMessage } from "../utils/apiError";

type OtpPayload = {
    otp: string;
};

type ValidationErrors = Partial<Record<keyof OtpPayload | "global", string>>;

type OtpResult = {
    success: boolean;
    message?: string;
    errors?: ValidationErrors;
};

export const useOtpVerify = (email: string) => {
    const dispatch = useAppDispatch();

    const validateForm = (payload: OtpPayload): ValidationErrors => {
        const errors: ValidationErrors = {};
        if (!payload.otp) errors.otp = "OTP is required";
        else if (payload.otp.length !== 6) errors.otp = "OTP must be 6 digits";
        else if (!/^\d+$/.test(payload.otp)) errors.otp = "OTP must contain only numbers";
        return errors;
    };

    const handleOtpVerify = async (payload: OtpPayload): Promise<OtpResult> => {
        const errors = validateForm(payload);
        if (Object.keys(errors).length > 0) return { success: false, errors };

        if (!email) return { success: false, errors: { global: "Email is missing" } };

        try {
            const resultAction = await dispatch(verifyOtp({ email, otp: payload.otp }));
            if (verifyOtp.fulfilled.match(resultAction)) {
                return { success: true, message: "OTP verification successful!" };
            } else {
                return {
                    success: false,
                    errors: {
                        global: (resultAction.payload as string) || "OTP verification failed",
                    },
                };
            }
        } catch (err) {
            return { success: false, errors: { global: getApiErrorMessage(err) || "Something went wrong" } };
        }
    };

    const handleResendOtp = async (): Promise<OtpResult> => {
        if (!email) return { success: false, errors: { global: "Email is missing" } };

        try {
            const resultAction = await dispatch(resendOtp(email));
            if (resendOtp.fulfilled.match(resultAction)) {
                return { success: true, message: "OTP sent successfully" };
            } else {
                return {
                    success: false,
                    errors: { global: (resultAction.payload as string) || "Resend failed" },
                };
            }
        } catch (err) {
            return { success: false, errors: { global: getApiErrorMessage(err) || "Something went wrong" } };
        }
    };

    const [formData, setFormData] = useState<OtpPayload>({ otp: "" });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);

    const handleFieldChange = (field: keyof OtpPayload, value: string) => {
        setFormData({ ...formData, [field]: value });
        const fieldError = validateForm({ ...formData, [field]: value })[field];
        setErrors((prev) => ({ ...prev, [field]: fieldError }));
    };

    const handleSubmit = async () => {
        setErrors({});
        setLoading(true);

        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return { success: false, errors: validationErrors };
        }

        const result = await handleOtpVerify(formData);
        setLoading(false);

        if (!result.success && result.errors?.global) {
            setErrors(result.errors);
        }

        return result;
    };

    return { formData, errors, loading, handleFieldChange, handleSubmit, handleResendOtp };
};
