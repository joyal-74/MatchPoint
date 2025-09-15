import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import { useResetPassword } from "../../hooks/useResetPassword";
import FormField from "../../components/common/FormField";
import { ToastContainer } from "react-toastify";
import LoadingOverlay from "../../components/common/LoadingOverlay";

const ResetPasswordPage: React.FC = () => {
    const [formData, setFormData] = useState({ password: "", confirmPassword: "" });

    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; global?: string }>({});
    const [loading, setLoading] = useState(false);
    const { handleResetPassword } = useResetPassword();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setLoading(true)
        const result = await handleResetPassword(formData);
        setLoading(false)

        if (!result.success) {
            if (result.errors?.global) {
                alert(result.errors.global);
            }

            const fieldErrors = { ...result.errors };
            delete fieldErrors.global;
            setErrors(fieldErrors);
        } else {
            if (result.message) {
                alert(result.message);
                navigate("/login");
            }
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <LoadingOverlay show={loading} />
            <AuthForm
                title="Reset Password"
                subtitle="Please enter your new password below and confirm to reset."
                buttonText="Reset Password"
                onSubmit={handleSubmit}
                footer={
                    <>
                        Remembered your password?{" "}
                        <span
                            className="text-[var(--color-text-accent)] hover:underline"
                            onClick={() => navigate("/signup")}
                        >
                            Signup
                        </span>
                    </>
                }
            >
                <FormField
                    id="password"
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={errors.password}
                />

                <FormField
                    id="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    error={errors.confirmPassword}
                />

            </AuthForm>
        </>

    );
};

export default ResetPasswordPage;