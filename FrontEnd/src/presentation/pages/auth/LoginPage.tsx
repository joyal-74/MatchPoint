import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login data:", formData);
    };

    const navigate = useNavigate();

    return (
        <AuthForm
            title="Welcome Back"
            subtitle="Enter credentials to login to your account"
            buttonText="Sign In"
            onSubmit={handleSubmit}
            footer={
                <>
                    Don’t have an account?{" "} <span className="text-[var(--color-text-accent)] hover:underline" onClick={()=> navigate("/signup")}>Signup</span>
                </>
            }
        >
            {/* Email */}
            <div className="flex flex-col text-sm">
                <label htmlFor="email" className="text-sm mb-1">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 rounded-md bg-[var(--color-surface-raised)] placeholder-gray-400 focus:outline-none"
                />
            </div>

            {/* Password */}
            <div className="flex flex-col text-sm">
                <label htmlFor="password" className="text-sm mb-1">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full p-3 rounded-md bg-[var(--color-surface-raised)] placeholder-gray-400 focus:outline-none"
                />
            </div>

            <h1 className="text-end text-sm text-[var(--color-link)]" onClick={()=> navigate("/forgot-password")}>Forgot Password ?</h1>
        </AuthForm>
    );
};

export default LoginPage;