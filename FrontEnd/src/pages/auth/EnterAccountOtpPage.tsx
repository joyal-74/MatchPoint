import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useOtpVerify } from "../../hooks/useOtpVerify";

// Components
import OtpVerify from "../../components/shared/OtpVerify";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import FormFooter from "../../components/shared/FormFooter";
import AuthForm from "../../components/shared/AuthForm";

const EnterAccountOtpPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Retrieve email/expiry passed from the Signup page
    const { expiresAt, email } = location.state || {};

    const { 
        formData, 
        errors, 
        loading, 
        handleFieldChange, 
        handleSubmit, 
        handleResendOtp,
        isOtpExpired 
    } = useOtpVerify(email, 'verify_email', expiresAt);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();
        
        if (result.success) {
            toast.success(result.message || "Signup successful! Please login.");
            navigate("/login");
        } else if (result.errors?.global) {
            toast.error(result.errors.global);
        }
    };

    const resendOtp = async () => {
        const result = await handleResendOtp();
        if (result.success) {
            toast.success(result.message || "OTP resent successfully");
            // If your API returns a new expiry, you might want to update it here 
            // via a local state, but usually the timer just resets.
        } else {
            if (result.errors?.global) {
                toast.error(result.errors.global);
            }
        }
    };

    return (
        <>
            <LoadingOverlay show={loading} />
            
            <AuthForm
                mainHeading="Verify Account"
                subHeading="Final Step"
                subtitle={`We’ve sent a one-time password (OTP) to ${email}. Please enter it below to verify your account.`}
                buttonText="Verify & Register"
                onSubmit={onSubmit}
                showSocialButtons={false}
                footer={
                    <div className="flex flex-col gap-4 text-center mt-2">
                        <FormFooter
                            text="Didn’t receive the OTP?"
                            linkText="Resend Code"
                            onClick={resendOtp}
                            disabled={!isOtpExpired}
                        />
                        
                        <FormFooter
                            text="Already verified?"
                            linkText="Sign In"
                            linkTo="/login"
                        />
                    </div>
                }
            >
                <div className="py-4">
                    <OtpVerify
                        otp={formData.otp}
                        setOtp={(val) => handleFieldChange("otp", val)}
                        expiresAt={expiresAt}
                        error={errors.otp}
                    />
                </div>
            </AuthForm>
        </>
    );
};

export default EnterAccountOtpPage;