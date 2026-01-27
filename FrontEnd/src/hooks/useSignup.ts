import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/hooks";
import toast from "react-hot-toast";
import { signupUser, loginUserGoogle, loginUserFacebook } from "../features/auth/authThunks";
import { SignupRoles, type Gender, type SignupRole } from "../types/UserRoles";
import { validateSignup } from "../validators/SignpValidators";

export interface SignUpFormExtended {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: Gender;
    password: string;
    confirmPassword: string;
    role: SignupRole;
    battingStyle?: string;
    bowlingStyle?: string;
    playingPosition?: string;
    jerseyNumber?: string;
    profileImage?: File | null;
}

type FormErrors = Partial<Record<keyof SignUpFormExtended, string>> & { global?: string };

export const useSignup = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignUpFormExtended>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "male" as Gender,
        password: "",
        confirmPassword: "",
        role: SignupRoles.Player,
        battingStyle: "Right Hand",
        bowlingStyle: "",
        playingPosition: "",
        jerseyNumber: "",
        profileImage: null
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    // Dynamic validation as user types
    const handleFieldChange = <K extends keyof SignUpFormExtended>(field: K, value: SignUpFormExtended[K]) => {
        const updatedData = { ...formData, [field]: value };
        setFormData(updatedData);
        const validationErrors = validateSignup(updatedData);
        setErrors((prev) => ({
            ...prev,
            [field]: validationErrors[field] ? (validationErrors[field] as string) : undefined
        }));
    };

    const isStepValid = (step: number, hasPreview: boolean): boolean => {
        const v = validateSignup(formData);
        console.log(v, 'v')
        if (step === 1) {
            return !!(formData.firstName && formData.lastName && hasPreview && !v.firstName && !v.lastName && !v.profileImage);
        }
        if (step === 2) {
            return !!(
                formData.battingStyle &&
                formData.bowlingStyle &&
                formData.playingPosition &&
                formData.jerseyNumber &&
                !v.battingStyle &&
                !v.bowlingStyle &&
                !v.playingPosition &&
                !v.jerseyNumber
            );
        }
        if (step === 3) {
            return !v.email && !v.password && !!formData.confirmPassword && !v.confirmPassword;
        }
        return true;
    };

    const handleSignupSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setErrors({});

        setLoading(true);
        try {
            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    data.append(key, value instanceof File ? value : String(value));
                }
            });

            const res = await dispatch(signupUser(data)).unwrap();

            toast.success("Account created!");
            navigate("/otp-verify", { state: { email: formData.email, expiresAt: res.expiresAt } });
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async (token: string) => {
        setLoading(true);
        try {
            await dispatch(loginUserGoogle(token)).unwrap();
            navigate('/dashboard');
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Google Auth failed");
        } finally {
            setLoading(false);
        }
    };

    const handleFacebookSignUp = async (token: string) => {
        setLoading(true);
        try {
            await dispatch(loginUserFacebook(token)).unwrap();
            navigate('/dashboard');
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Facebook Auth failed");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        errors,
        setErrors,
        loading,
        isStepValid,
        handleFieldChange,
        handleSignupSubmit,
        handleGoogleSignUp,
        handleFacebookSignUp
    };
};