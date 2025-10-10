import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import RolePicker from "../../components/shared/RolePicker";
import FormFieldGroup from "../../components/shared/FormFieldGroup";
import FormFooter from "../../components/shared/FormFooter";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { toast, ToastContainer } from "react-toastify";
import { useSignup } from "../../hooks/useSignup";
import { rows, type SignUpForm } from "../../utils/helpers/SignupFields";

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const { formData, handleFieldChange, handleSubmit, errors, loading, } = useSignup();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();

        if (result.success) {
            toast.success(result.message || "Signup successful!", {
                onClose: () =>
                    navigate("/otp-verify", {
                        state: { expiresAt: result.expiresAt, email: result.email },
                    }),
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
                title="Create new Account"
                buttonText="Sign Up"
                onSubmit={onSubmit}
                footer={<FormFooter text="Already have an account?" linkText="Login" linkTo="/login" />}
            >
                <RolePicker selectedRole={formData.role} onChange={(role) => handleFieldChange("role", role)} />

                {rows.map((row) => (
                    <FormFieldGroup<SignUpForm>
                        key={row[0].id}
                        fields={row}
                        formData={formData}
                        errors={errors}
                        handleFieldChange={handleFieldChange}
                    />
                ))}
            </AuthForm>
        </>
    );
};

export default SignupPage;