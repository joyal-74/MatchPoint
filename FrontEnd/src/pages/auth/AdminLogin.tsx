import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/shared/AuthForm";
import FormField from "../../components/shared/FormField";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { useLoginAdmin } from "../../hooks/useLoginAdmin";
import toast from "react-hot-toast";

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
            <LoadingOverlay show={loading} />

            <AuthForm
                mainHeading={<h1>Welcome Back</h1>}
                subHeading="Manage, monitor, and control"
                subtitle="Sign in to access your admin dashboard"
                buttonText="Login"
                onSubmit={onSubmit}
                footer={<p>Not an Admin?</p>}
                showSocialButtons={false}
                subfooter={<span className="text-primary cursor-pointer hover:underline" onClick={() => navigate('/login')}>Login as User</span>}
            >

                <FormField
                    id="email" label="Email" type="email" value={formData.email} placeholder="Enter your email"
                    onChange={(e) => handleFieldChange("email", e.target.value)} className="w-full" error={errors.email}
                />

                <FormField
                    id="password" label="Password" type="password" value={formData.password} placeholder="Enter your password"
                    onChange={(e) => handleFieldChange('password', e.target.value)} className="w-full" error={errors.password}
                />
            </AuthForm >
        </>
    );
};

export default AdminLoginPage;