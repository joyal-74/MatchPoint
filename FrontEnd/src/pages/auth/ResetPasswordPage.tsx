import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useResetPassword } from "../../hooks/useResetPassword";
import { resetPassFields } from "../../utils/helpers/ResetPassFields";
import { useSmoothLoading } from "../../hooks/ui/useSmoothLoading";

import LoadingOverlay from "../../components/shared/LoadingOverlay";
import FormFieldGroup from "../../components/shared/FormFieldGroup";
import FormFooter from "../../components/shared/FormFooter";
import AuthForm from "../../components/shared/AuthForm";

const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const { formData, errors, loading, handleFieldChange, handleSubmit } = useResetPassword();
    
    const showLoader = useSmoothLoading(loading);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();
        if (result.success) {
            toast.success(result.message || "Password reset successful!");
            navigate("/login");
        } else if (result.errors?.global) {
            toast.error(result.errors.global);
        }
    };

    return (
        <>
            <LoadingOverlay show={showLoader} />
            
            <AuthForm
                mainHeading="Reset Password"
                subHeading="Secure your account"
                subtitle="Enter a new password to reset your account access."
                buttonText="Reset Password"
                onSubmit={onSubmit}
                showSocialButtons={false}
                footer={
                    <div className="mt-4 text-center">
                        <FormFooter
                            text="Remembered your password?"
                            linkText="Sign In"
                            linkTo="/login"
                        />
                    </div>
                }
            >
                <div className="space-y-4">
                    {resetPassFields.map((row) => (
                        <FormFieldGroup
                            key={row.id}
                            fields={[row]}
                            formData={formData}
                            errors={errors}
                            handleFieldChange={handleFieldChange}
                        />
                    ))}
                </div>
            </AuthForm>
        </>
    );
};

export default ResetPasswordPage;