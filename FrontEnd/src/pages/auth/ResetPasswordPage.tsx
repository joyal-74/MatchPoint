import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { ToastContainer, toast } from "react-toastify";
import { useResetPassword } from "../../hooks/useResetPassword";
import FormFooter from "../../components/shared/FormFooter";
import { resetPassFields, type ResetPassForm } from "../../utils/helpers/ResetPassFields";
import FormFieldGroup from "../../components/shared/FormFieldGroup";

const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const { formData, errors, loading, handleFieldChange, handleSubmit } = useResetPassword();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();
        if (result.success) {
            toast.success(result.message || "Password reset successful!", {
                onClose: () => navigate("/login"),
            });
        } else if (result.errors?.global) {
            toast.error(result.errors.global);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <LoadingOverlay show={loading} />
            <AuthForm
                title="Reset Password"
                subtitle="Enter a new password to reset your account."
                buttonText="Reset Password"
                onSubmit={onSubmit}
                footer={<FormFooter text="Remembered your password?" linkText="SignIn" linkTo="/login" />}
            >

                {resetPassFields.map((row) => (
                    <FormFieldGroup<ResetPassForm>
                        key={row.id}
                        fields={[row]}
                        formData={formData}
                        errors={errors}
                        handleFieldChange={handleFieldChange}
                    />
                ))}

            </AuthForm>
        </>
    );
};

export default ResetPasswordPage;