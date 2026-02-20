import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignup, type SignUpFormExtended } from "../../hooks/useSignup";
import { SignupRoles, UserRole, type Gender, type SignupRole } from "../../types/UserRoles";
import { ArrowLeft, Mail, Lock, Phone, Hash } from "lucide-react";
import SocialAuth from "./SignUp/SocialAuth";
import { FormInput } from "./SignUp/FormInput";
import { FormSelect } from "./SignUp/FormSelect";
import StepHeader from "./SignUp/StepHeader";
import StepIndicator from "./SignUp/StepIndicator";
import AvatarUpload from "./SignUp/AvatarUpload";
import RolePicker from "./SignUp/RolePicker";
import toast from "react-hot-toast";
import { validateSignup } from "../../validators/SignpValidators";
import { Link } from "react-router-dom";
import { clearSignupDraft } from "../../features/auth";
import { useAppDispatch } from "../../hooks/hooks";

const SignupPage = () => {
    const { formData, preview,
        setPreview, loading, handleFieldChange, handleSignupSubmit, handleGoogleSignUp,
        handleFacebookSignUp, isStepValid, errors, setErrors }
        = useSignup();
    const [step, setStep] = useState(1);
    const dispatch = useAppDispatch();

    const canGoNext = isStepValid(step, !!preview);

    useEffect(() => {
        return () => {
            dispatch(clearSignupDraft());
        };
    }, [dispatch]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFieldChange("profileImage", file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleNext = () => {
        const allErrors = validateSignup(formData);
        const stepFields: Record<number, (keyof SignUpFormExtended)[]> = {
            1: ["firstName", "lastName", "profileImage"],
            2: ["battingStyle", "bowlingStyle", "playingPosition", "jerseyNumber"],
            3: ["email", "phone", "password", "confirmPassword", "gender"]
        };

        const currentStepFields = stepFields[step] || [];
        const visibleErrors = currentStepFields.reduce((acc, field) => {
            if (allErrors[field]) acc[field] = allErrors[field];
            return acc;
        }, {} as Partial<Record<keyof SignUpFormExtended, string>>);

        if (Object.keys(visibleErrors).length > 0) {
            setErrors(visibleErrors);
            toast.error(`Please complete Step ${step} correctly.`);
            return;
        }

        setErrors({});
        if (step === 1 && formData.role !== UserRole.Player) {
            setStep(3);
        } else {
            setStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (step === 3 && formData.role !== UserRole.Player) setStep(1);
        else setStep((prev) => prev - 1);
    };

    const handleAction = (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            handleNext();
        } else {
            handleSignupSubmit();
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Decorative Mesh */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-[100px]" />
            </div>

            {/* Container: Fixed height for desktop to prevent layout shifts */}
            <div className="w-full lg:h-[680px] max-w-[950px] bg-transparent md:bg-card border border-border rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden transition-all duration-500">

                {/* --- SIDEBAR --- */}
                <div className="lg:w-[32%] bg-muted/30 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between relative">
                    <div className="z-10">
                        <div className="flex items-center gap-2 mb-8 lg:mb-12">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center rotate-3 shadow-lg shadow-primary/20">
                                <span className="text-primary-foreground font-black text-xs">MP</span>
                            </div>
                            <h1 className="text-xl font-black uppercase tracking-tighter text-foreground text-nowrap">MatchPoint</h1>
                        </div>

                        <div className="mb-10 hidden lg:block">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h2 className="text-2xl font-bold leading-tight text-foreground">
                                        {step === 1 && "Start your journey."}
                                        {step === 2 && "Show your worth."}
                                        {step === 3 && "Join the arena."}
                                    </h2>
                                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                        {step === 1 && "Create a professional identity that stands out globally."}
                                        {step === 2 && "Your technical stats help us match you with opportunities."}
                                        {step === 3 && "Secure your account to begin your professional career."}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <StepIndicator current={step} total={3} />
                    </div>

                    <div className="hidden lg:block z-10">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                            Professional Sports Management
                        </p>
                    </div>
                </div>

                {/* --- FORM SECTION --- */}
                <div className="flex-1 p-6 md:p-8 lg:p-10 bg-card flex flex-col overflow-y-auto lg:overflow-visible">
                    <form className="max-w-xl mx-auto w-full flex flex-col h-full" onSubmit={(e) => e.preventDefault()}>

                        {/* Scrollable Content Area */}
                        <div className="flex-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <StepHeader step={step} />

                                    {step === 1 && (
                                        <div className="space-y-3">
                                            <AvatarUpload preview={preview} error={errors.profileImage} onImageChange={handleImageChange} />
                                            <RolePicker
                                                selectedRole={formData.role}
                                                onRoleChange={(role) => handleFieldChange("role", role as SignupRole)}
                                                roles={Object.values(SignupRoles)}
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                <FormInput label="First Name" error={errors.firstName} placeholder="Cristiano" value={formData.firstName} onChange={(v) => handleFieldChange("firstName", v)} />
                                                <FormInput label="Last Name" error={errors.lastName} placeholder="Ronaldo" value={formData.lastName} onChange={(v) => handleFieldChange("lastName", v)} />
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                                            <FormSelect value={formData.battingStyle} label="Batting Style" error={errors.battingStyle} options={[{ value: 'RHB', label: 'Right Hand' }, { value: 'LHB', label: 'Left Hand' }]} onChange={(v) => handleFieldChange("battingStyle", v)} />
                                            <FormSelect value={formData.bowlingStyle} label="Bowling Style" error={errors.bowlingStyle} options={[
                                                { value: 'None', label: 'None' },
                                                { value: 'Right-arm Fast', label: 'Right-arm Fast' },
                                                { value: 'Right-arm Fast Medium', label: 'Right-arm Fast Medium' },
                                                { value: 'Right-arm Off Spin', label: 'Right-arm Off Spin' },
                                                { value: 'Right-arm Leg Spin', label: 'Right-arm Leg Spin' },
                                                { value: 'Left-arm Orthodox', label: 'Left-arm Orthodox' },
                                                { value: 'Left-arm Fast', label: 'Left-arm Fast' }
                                            ]} onChange={(v) => handleFieldChange("bowlingStyle", v)} />
                                            <FormSelect value={formData.playingPosition} label="Position" error={errors.playingPosition} options={[{ value: 'bt', label: 'Batting' }, { value: 'bl', label: 'Bowling' }, { value: 'ar', label: 'All Rounder' }, { value: 'wk', label: 'Wicket Keeper' }]} onChange={(v) => handleFieldChange("playingPosition", v)} />
                                            <FormInput icon={Hash} error={errors.jerseyNumber} label="Jersey #" type="number" value={formData.jerseyNumber} onChange={(v) => handleFieldChange("jerseyNumber", v)} />
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div className="space-y-3">
                                            <FormInput icon={Mail} error={errors.email} label="Email" type="email" value={formData.email} placeholder="Enter your email" onChange={(v) => handleFieldChange("email", v)} />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <FormInput icon={Phone} error={errors.phone} label="Phone" placeholder="Enter your mobile number" value={formData.phone} onChange={(v) => handleFieldChange("phone", v)} />
                                                <FormSelect label="Gender" value={formData.gender} error={errors.gender} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} onChange={(v) => handleFieldChange("gender", v as Gender)} />
                                            </div>
                                            {!formData.isSocial && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <FormInput icon={Lock} error={errors.password} placeholder="Set your password" label="Password" type="password" onChange={(v) => handleFieldChange("password", v)} />
                                                    <FormInput icon={Lock} error={errors.confirmPassword} placeholder="Confirm your password" label="Confirm" type="password" onChange={(v) => handleFieldChange("confirmPassword", v)} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* NAV BUTTONS & LINKS - Pinned to bottom */}
                        <div className="mt-6">
                            <div className="flex gap-3">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="h-11 px-5 rounded-xl border border-input active:scale-95 transition-all flex items-center justify-center hover:bg-muted"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleAction}
                                    className={`flex-1 h-11 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 
                                        ${!canGoNext ? "bg-primary/70 text-white/80" : "bg-primary text-white shadow-md active:scale-[0.98]"}`}
                                >
                                    {loading ? "..." : step === 3 ? "Complete Sign Up" : "Next Step"}
                                </button>
                            </div>

                            <div className="mt-4 space-y-3 text-center">
                                {step === 1 && (
                                    <>
                                        <SocialAuth onGoogle={handleGoogleSignUp} onFacebook={handleFacebookSignUp} />
                                        <p className="text-xs text-muted-foreground font-medium">
                                            Already have an account?{" "}
                                            <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
                                        </p>
                                    </>
                                )}

                                <Link
                                    to="/privacy"
                                    className="block text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 hover:text-primary transition-colors"
                                >
                                    Privacy Policy & Usage Terms
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default SignupPage;