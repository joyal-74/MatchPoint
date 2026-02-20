import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import toast from "react-hot-toast";
import { signupUser, loginUserGoogle, loginUserFacebook, loginUserSocialComplete } from "../features/auth/authThunks";
import { SignupRoles, type Gender, type SignupRole } from "../types/UserRoles";
import { validateSignup } from "../validators/SignpValidators";
import type { CompleteUserData } from "../types/api/UserApi";
import { clearSignupDraft } from "../features/auth";

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
    profileImage?: File | string | null;
    isSocial?: boolean;
    tempToken?: string | null;
}

type FormErrors = Partial<Record<keyof SignUpFormExtended, string>> & { global?: string };

export const useSignup = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const draft = useAppSelector((s) => s.auth.signupDraft);

    const [formData, setFormData] = useState<SignUpFormExtended>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "" as Gender,
        password: "",
        confirmPassword: "",
        role: SignupRoles.Player,
        battingStyle: "",
        bowlingStyle: "",
        playingPosition: "",
        jerseyNumber: "",
        profileImage: null,
        isSocial: false,
        tempToken: null,
        ...draft
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
        if (step === 1) {
            // Step 1 is valid if names exist and (either a preview exists OR it's social)
            return !!(formData.firstName && formData.lastName && (hasPreview || formData.isSocial) && !v.firstName && !v.lastName);
        }
        if (step === 2) {
            return !!(formData.battingStyle && formData.bowlingStyle && formData.playingPosition && formData.jerseyNumber && !v.battingStyle && !v.bowlingStyle && !v.playingPosition && !v.jerseyNumber);
        }
        if (step === 3) {
            if (formData.isSocial) return !!(formData.phone && formData.gender && !v.phone && !v.gender);
            return !!(!v.email && !v.password && formData.confirmPassword && !v.confirmPassword);
        }
        return true;
    };

    const handleSignupSubmit = async () => {
        setErrors({});
        setLoading(true);
        try {
            if (formData.isSocial) {
                const socialData: CompleteUserData = {
                    tempToken: formData.tempToken!,
                    role: formData.role,
                    gender: formData.gender,
                    phone: formData.phone,
                    username: `${formData.firstName.toLowerCase()}${formData.lastName.toLowerCase()}`,
                    authProvider: "google",
                    sport: "Cricket",
                };

                await dispatch(loginUserSocialComplete(socialData)).unwrap();
                dispatch(clearSignupDraft());
                
                toast.success("Welcome to MatchPoint!");
                navigate("/login");

            } else {
                const data = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        data.append(key, value instanceof File ? value : String(value));
                    }
                });

                const res = await dispatch(signupUser(data)).unwrap();
                toast.success("Account created!");
                navigate("/otp-verify", { state: { email: formData.email, expiresAt: res.expiresAt } });
            }
        } catch (err) {
            toast.error(typeof err === "string" ? err : "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async (token: string) => {
        setLoading(true);
        try {
            const result = await dispatch(loginUserGoogle(token)).unwrap();

            if (result.tempToken) {
                toast.success("Google verified! Complete your profile.");
            } else if (result.accessToken) {
                toast.success("Welcome back!");
                navigate("/");
            }
        } catch (err) {
            console.error("Auth Error:", err);
            toast.error("Google Auth failed");
        } finally {
            setLoading(false);
        }
    };

    const handleFacebookSignUp = async (token: string) => {
        setLoading(true);
        try {
            const result = await dispatch(loginUserFacebook(token)).unwrap();
            if (result.tempToken) {
                setFormData(prev => ({
                    ...prev,
                    firstName: result.user?.firstName || "",
                    lastName: result.user?.lastName || "",
                    email: result.user?.email || "",
                    profileImage: result.user?.profileImage || null,
                    isSocial: true,
                    tempToken: result.tempToken
                }));

                if (result.user?.profileImage) {
                    setPreview(result.user.profileImage);
                }
                toast.success("Facebook verified! Complete your profile.");
            } else if (result.accessToken) {
                toast.success("Welcome back!");
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            toast.error("Facebook Auth failed");
        } finally {
            setLoading(false);
        }
    };

    return { formData, preview, setPreview, errors, setErrors, loading, isStepValid, handleFieldChange, handleSignupSubmit, handleGoogleSignUp, handleFacebookSignUp };
};