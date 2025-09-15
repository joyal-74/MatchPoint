import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import FormField from "../../components/common/FormField";
import { useLogin } from "../../hooks/useLogin";
import type { LoginRequest } from "../../../shared/types/api/UserApi";
import Alert from "../../components/common/Alert";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { handleLogin } = useLogin();

    const [formData, setFormData] = useState<LoginRequest>({ email: "", password: "", });
    const [alert, setAlert] = useState<{ type: "success" | "error" | "warning" | "info"; message: string; title?: string; } | null>(null);

    const [errors, setErrors] = useState<Partial<Record<keyof LoginRequest, string>>>({});

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await handleLogin(formData);
        if (result.success) {
            setAlert({ message: "Login successful!", type: "success" });
        } else if (result.errors) {
            setAlert({ message: result.errors.global || "Login failed", type: "error" });
            setErrors(result.errors);
        }
    };

    return (
        <AuthForm
            title="Login to your Account"
            buttonText="Login"
            onSubmit={onSubmit}
            footer={
                <>
                    Don’t have an account?{" "}
                    <span
                        className="text-[var(--color-text-accent)] hover:underline cursor-pointer"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </span>
                </>
            }
        >
            <FormField
                id="email"
                label="Email"
                type="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full"
                error={errors.email}
            />

            <FormField
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                placeholder="Enter your password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full"
                error={errors.password}
            />
            <h1 className="text-end text-sm text-[var(--color-link)]" onClick={() => navigate("/forgot-password")}>Forgot Password ?</h1>
            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(null)}
                />
            )}
        </AuthForm>
    );
};

export default LoginPage;