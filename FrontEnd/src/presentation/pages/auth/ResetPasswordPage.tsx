import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import { useResetPassword } from "../../hooks/useResetPassword";
import FormField from "../../components/common/FormField";

const ResetPasswordPage: React.FC = () => {
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; global?: string }>({});
    const { handleResetPassword } = useResetPassword();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await handleResetPassword(formData);
        if (!result.success) setErrors(result.errors);
    };

    return (
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

            {errors.global && <p className="text-red-500 text-sm mt-2">{errors.global}</p>}
        </AuthForm>
    );
};

export default ResetPasswordPage;