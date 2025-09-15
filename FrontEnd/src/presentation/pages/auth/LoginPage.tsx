import React, { useState } from "react";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import FormField from "../../components/common/FormField";
import { useLogin } from "../../hooks/useLogin";
import type { LoginRequest } from "../../../shared/types/api/UserApi";
import { toast, ToastContainer } from "react-toastify";
import LoadingOverlay from "../../components/common/LoadingOverlay";


const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { handleLogin } = useLogin();

    const [formData, setFormData] = useState<LoginRequest>({ email: "", password: "" });
    const [errors, setErrors] = useState<Partial<Record<keyof LoginRequest, string>>>({});
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        const result = await handleLogin(formData);
        setLoading(false);

        if (result.success) {
            toast.success(result.message || "Login successful!");
        } else if (result.errors) {

            if (result.errors.global) toast.error(result.errors.global);

            const fieldErrors = { ...result.errors };
            delete fieldErrors.global;
            setErrors(fieldErrors);
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
            </AuthForm>
        </>
    );
};

export default LoginPage;