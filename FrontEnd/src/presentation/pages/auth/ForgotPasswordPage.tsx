import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Forgot password request for:", email);
        // here you would call your backend API
    };

    return (
        <AuthForm
            title="Forgot Password"
            subtitle="Forgot your password? Don’t worry — just enter your email and we’ll send you a one-time password to reset it."
            buttonText="Send OTP"
            onSubmit={handleSubmit}
            footer={
                <>
                    Remembered your password?{" "} <span className="text-[var(--color-text-accent)] hover:underline" onClick={()=> navigate("/signup")}>Signup</span>
                </>
            }
        >

            <div className="flex flex-col text-sm">
                <label htmlFor="email" className="text-sm mb-1">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-md bg-[var(--color-surface-raised)] placeholder-gray-400 focus:outline-none"
                />
            </div>
        </AuthForm>
    );
};

export default ForgotPasswordPage;