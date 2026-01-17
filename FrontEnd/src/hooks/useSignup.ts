import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import toast from "react-hot-toast";

// Redux Types
import type { PayloadAction, SerializedError } from "@reduxjs/toolkit";

// Actions
import { signupUser, loginUserGoogle } from "../features/auth/authThunks";

// Types & Validators
import { UserRole, type Gender } from "../types/UserRoles";
import { validateSignup } from "../validators/SignpValidators";
import type { SignUpForm } from "../utils/helpers/SignupFields";

// 1. Define Strict Action Types for the two different operations
// Signup returns specific data needed for OTP
interface SignupSuccessPayload {
    expiresAt: string;
    email: string;
    message?: string;
}

// Google Login returns user/token data
interface GoogleSuccessPayload {
    user?: { role: UserRole };
    token?: string;
    message?: string;
}

export const useSignup = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState<SignUpForm>({
        firstName: "",
        lastName: "",
        email: "",
        phone: '',
        gender: "male" as Gender,
        password: "",
        confirmPassword: "",
        role: UserRole.Player,
        sport: "",
    });

    const [errors, setErrors] = useState<Partial<SignUpForm> & { global?: string }>({});
    const [loading, setLoading] = useState(false);

    // --- Helpers ---
    const handleFieldChange = (field: keyof SignUpForm, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        
        // Dynamic Validation on change
        // We validate just this field to clear errors
        const currentErrors = validateSignup({ ...formData, [field]: value });
        setErrors((prev) => ({
             ...prev, 
             [field]: currentErrors[field] ? currentErrors[field] : undefined 
        }));
    };

    // --- Handler: Standard Signup ---
    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        
        // 1. Validate
        const validationErrors = validateSignup(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        // 2. Dispatch
        // We cast the result to a specific PayloadAction type to avoid 'any'
        const resultAction = await dispatch(signupUser(formData)) as PayloadAction<
            SignupSuccessPayload | string, // Payload
            string,                        // Type
            { requestStatus: "fulfilled" | "rejected" },
            SerializedError                // Error
        >;

        setLoading(false);

        // 3. Handle Result
        if (resultAction.meta.requestStatus === 'fulfilled') {
            const payload = resultAction.payload as SignupSuccessPayload;
            
            toast.success(payload.message || "Signup successful! Verify your account.");
            
            // Navigate to OTP page with necessary state
            navigate("/otp-verify", { 
                state: { 
                    expiresAt: payload.expiresAt, 
                    email: formData.email // or payload.email
                } 
            });
        } else {
            const backendError = (resultAction.payload as string) || "Signup failed";
            toast.error(backendError);
            setErrors({ global: backendError });
        }
    };

    // --- Handler: Google Signup ---
    const handleGoogleSignUp = async (token: string) => {
        setLoading(true);
        
        const resultAction = await dispatch(loginUserGoogle(token)) as PayloadAction<
            GoogleSuccessPayload | string,
            string,
            { requestStatus: "fulfilled" | "rejected" },
            SerializedError
        >;

        setLoading(false);

        if (resultAction.meta.requestStatus === 'fulfilled') {
            const payload = resultAction.payload as GoogleSuccessPayload;
            toast.success("Google signup successful!");
            // Google usually logs you in directly, so go to dashboard
            navigate('/dashboard');
            return { success: true, role: payload.user?.role };
        } else {
            const backendError = (resultAction.payload as string) || "Google signup failed";
            toast.error(backendError);
            setErrors({ global: backendError });
            return { success: false };
        }
    };

    return {
        formData,
        errors,
        loading,
        handleFieldChange,
        handleSignupSubmit,
        handleGoogleSignUp,
    };
};