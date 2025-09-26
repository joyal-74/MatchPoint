import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { toast, ToastContainer } from "react-toastify";
import { useLogin } from "../../hooks/useLogin";
import { UserRole } from "../../types/UserRoles";
import FormFooter from "../../components/shared/FormFooter";
import { loginFields, type LoginForm } from "../../utils/helpers/LoginFields";
import FormFieldGroup from "../../components/shared/FormFieldGroup";

const LoginPage: React.FC = () => {

    const navigate = useNavigate();
    const { handleSubmit, handleFieldChange, errors, loading, formData } = useLogin();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();

        if (result.success) {
            toast.success(result.message || "Login successful!");

            const role = result.role;
            if (role === UserRole.Manager.toLowerCase()) navigate("/manager/dashboard");
            else if (role === UserRole.Viewer.toLowerCase()) navigate("/");
            else if (role === UserRole.Admin.toLowerCase()) navigate("/admin/dashboard");
            else if (role === UserRole.Player.toLowerCase()) navigate("/player/dashboard");
        } else if (result.errors?.global) {
            toast.error(result.errors.global);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <LoadingOverlay show={loading} />
            <AuthForm
                title="Login to your Account"
                buttonText="Login"
                onSubmit={onSubmit}
                footer={<FormFooter text="Don’t have an account?" linkText="Sign Up" linkTo="/signup" />}
            >
                {loginFields.map((row) => (
                    <FormFieldGroup<LoginForm>
                        key={row.id}
                        fields={[row]}
                        formData={formData}
                        errors={errors}
                        handleFieldChange={handleFieldChange}
                    />
                ))}

                <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-end text-sm text-[var(--color-link)] hover:underline" >
                        Forgot Password?
                    </Link>
                </div>
            </AuthForm>
        </>
    );
};

export default LoginPage;