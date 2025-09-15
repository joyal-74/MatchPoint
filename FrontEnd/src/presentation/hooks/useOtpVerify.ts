import { useAppDispatch } from "../store/hooks";
import { verifyOtp, resendOtp } from "../store/slices/auth/authThunks";

type ValidationErrors = { otp?: string; global?: string };

type OtpResult =
    | { success: true, message : string }
    | { success: false; errors: ValidationErrors };

export const useOtpVerification = (email : string) => {
    const dispatch = useAppDispatch();

    console.log(email)

    const validateForm = (otp: string): ValidationErrors => {
        const errors: ValidationErrors = {};
        if (!otp) errors.otp = "OTP is required";
        else if (otp.length !== 6) errors.otp = "OTP must be 6 digits";
        else if (!/^\d+$/.test(otp)) errors.otp = "OTP must contain only numbers";
        return errors;
    };

    const handleOtpVerify = async (otp: string): Promise<OtpResult> => {
        const errors = validateForm(otp);
        if (Object.keys(errors).length > 0) {
            return { success: false, errors };
        }

        if (!email) {
            return { success: false, errors: { global: "Email is missing" } };
        }

        try {
            const resultAction = await dispatch(verifyOtp({ email, otp }));
            if (verifyOtp.fulfilled.match(resultAction)) {
                return { success: true, message: "Otp Verification successsfull..!" };
            } else {
                return {
                    success: false,
                    errors: {
                        global: (resultAction.payload as string) || "OTP verification failed",
                    },
                };
            }
        } catch {
            return { success: false, errors: { global: "Something went wrong" } };
        }
    };

    const handleResendOtp = async (): Promise<OtpResult> => {
        if (!email) {
            return { success: false, errors: { global: "Email is missing" } };
        }

        try {
            const resultAction = await dispatch(resendOtp(email));
            if (resendOtp.fulfilled.match(resultAction)) {
                return { success: true, message : 'Otp sended successfully' };
            } else {
                return {
                    success: false,
                    errors: { global: (resultAction.payload as string) || "Resend failed" },
                };
            }
        } catch {
            return { success: false, errors: { global: "Something went wrong" } };
        } 
    };

    return { handleOtpVerify, handleResendOtp };
};