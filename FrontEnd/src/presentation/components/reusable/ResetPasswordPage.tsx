import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage: React.FC = () => {
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log("Reset password data:", formData);
        // Call backend API to reset password here
    };

    return (
        <AuthForm
            title="Reset Password"
            subtitle="Please enter your new password below and confirm to reset."
            buttonText="Reset Password"
            onSubmit={handleSubmit}
            footer={
                <>
                    Remembered your password?{" "} <span className="text-[var(--color-text-accent)] hover:underline" onClick={()=> navigate("/signup")}>Signup</span>
                </>
            }
        >

            {/* Password */}
            <div className="flex flex-col text-sm max-w-md w-full mx-auto">
                <label htmlFor="password" className="text-sm mb-1">
                    New Password
                </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full p-3 rounded-md bg-[var(--color-surface-raised)] placeholder-gray-400 focus:outline-none"
                />
            </div>

            <div className="flex flex-col text-sm max-w-md w-full mx-auto">
                <label htmlFor="confirmPassword" className="text-sm mb-1">
                    Confirm New Password
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="w-full p-3 rounded-md bg-[var(--color-surface-raised)] placeholder-gray-400 focus:outline-none"
                />
            </div>
        </AuthForm>
    );
};

export default ResetPasswordPage;
