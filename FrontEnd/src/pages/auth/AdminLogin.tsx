import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm";
import FormField from "../../components/shared/FormField";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { toast, ToastContainer } from "react-toastify";
import { useLoginAdmin } from "../../hooks/useLoginAdmin";
import FormFooter from "../../components/shared/FormFooter";

const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { handleSubmit, handleFieldChange, errors, loading, formData } = useLoginAdmin();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleSubmit();
        if (result.success) {
            toast.success(result.message || "Login successful!");
            navigate("/admin/dashboard");
        } else if (result.errors?.global) {
            toast.error(result.errors.global);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <LoadingOverlay show={loading} />
            <AuthForm
                title="Login to your Admin Account" buttonText="Login" onSubmit={onSubmit}
                footer={<FormFooter text="Not an admin?" linkText="Sign Up" linkTo="/signup" />}
            >
                <FormField
                    id="email" label="Email" type="email" value={formData.email} placeholder="Enter your email"
                    onChange={(e) => handleFieldChange("email", e.target.value)} className="w-full" error={errors.email}
                />

                <FormField
                    id="password" label="Password" type="password" value={formData.password} placeholder="Enter your password"
                    onChange={(e) => handleFieldChange('password', e.target.value)} className="w-full" error={errors.password}
                />
            </AuthForm>
        </>
    );
};

export default AdminLoginPage;