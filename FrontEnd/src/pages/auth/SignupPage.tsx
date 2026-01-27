import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignup, type SignUpFormExtended } from "../../hooks/useSignup";
import { SignupRoles, UserRole, type Gender, type SignupRole } from "../../types/UserRoles";
import { ArrowLeft, Mail, Lock, Phone, ChevronRight, Hash, Move } from "lucide-react";
import SocialAuth from "./SignUp/SocialAuth";
import { FormInput } from "./SignUp/FormInput";
import { FormSelect } from "./SignUp/FormSelect";
import StepHeader from "./SignUp/StepHeader";
import StepIndicator from "./SignUp/StepIndicator";
import AvatarUpload from "./SignUp/AvatarUpload";
import RolePicker from "./SignUp/RolePicker";
import toast from "react-hot-toast";
import { validateSignup } from "../../validators/SignpValidators";

const SignupPage = () => {
    const { formData, loading, handleFieldChange, handleSignupSubmit, handleGoogleSignUp, handleFacebookSignUp, isStepValid, errors, setErrors } = useSignup();
    const [step, setStep] = useState(1);
    const [preview, setPreview] = useState<string | null>(null);
    const canGoNext = isStepValid(step, !!preview);

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
            3: ["email", "phone", "password", "confirmPassword"]
        };

        const currentStepFields = stepFields[step] || [];

        const visibleErrors = currentStepFields.reduce((acc, field) => {
            if (allErrors[field]) acc[field] = allErrors[field];
            return acc;
        }, {} as Partial<Record<keyof SignUpFormExtended, string>>);

        if (step === 1 && !preview) {
            visibleErrors.profileImage = "Profile photo required";
        }

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
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 md:p-6 relative overflow-hidden">

            {/* Background Decorative Mesh */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-[100px]" />
            </div>

            <div className="w-full min-h-[665px] max-w-[950px] bg-transparent md:bg-card border border-border rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden transition-all duration-500">

                {/* --- SIDEBAR --- */}
                <div className="lg:w-[32%] bg-muted/30 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-border flex flex-col justify-between relative">
                    <div className="z-10">
                        <div className="flex items-center gap-2 mb-10">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center rotate-3 shadow-lg shadow-primary/20">
                                <span className="text-primary-foreground font-black text-xs">MP</span>
                            </div>
                            <h1 className="text-xl font-black uppercase tracking-tighter text-foreground">MatchPoint</h1>
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
                </div>

                {/* --- FORM SECTION --- */}
                <div className="flex-1 p-8 md:p-10 lg:p-12 bg-card flex flex-col">
                    <form className="max-w-xl mx-auto w-full flex flex-col h-full">
                        <div className="flex-1 min-h-[400px] md:min-h-[440px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="mb-4 md:mb-8">
                                        <StepHeader step={step} />
                                    </div>

                                    {step === 1 && (
                                        <div className="space-y-4 md:space-y-6"> {/* 3. Tighter spacing */}
                                            <AvatarUpload preview={preview} error={errors.profileImage} onImageChange={handleImageChange} />

                                            {/* 4. Ensure RolePicker uses a compact grid */}
                                            <RolePicker
                                                selectedRole={formData.role}
                                                onRoleChange={(role) => handleFieldChange("role", role as SignupRole)}
                                                roles={Object.values(SignupRoles)}
                                            />

                                            {/* 5. Tighter gap for Name inputs */}
                                            <div className="grid grid-cols-2 gap-2 md:gap-3">
                                                <FormInput label="First Name" error={errors.firstName} placeholder="Cristiano" value={formData.firstName} onChange={(v) => handleFieldChange("firstName", v)} />
                                                <FormInput label="Last Name" error={errors.lastName} placeholder="Ronaldo" value={formData.lastName} onChange={(v) => handleFieldChange("lastName", v)} />
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormSelect label="Batting Style" error={errors.battingStyle} options={[{ value: 'r', label: 'Right Hand' }, { value: 'l', label: 'Left Hand' }]} onChange={(v) => handleFieldChange("battingStyle", v)} />
                                            <FormInput icon={Move} error={errors.bowlingStyle} label="Bowling Style" placeholder="Off-Spin" value={formData.bowlingStyle} onChange={(v) => handleFieldChange("bowlingStyle", v)} />
                                            <FormInput icon={ChevronRight} error={errors.playingPosition} label="Position" placeholder="Midfielder" value={formData.playingPosition} onChange={(v) => handleFieldChange("playingPosition", v)} />
                                            <FormInput icon={Hash} error={errors.jerseyNumber} label="Jersey #" type="number" value={formData.jerseyNumber} onChange={(v) => handleFieldChange("jerseyNumber", v)} />
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div className="space-y-4">
                                            <FormInput icon={Mail} error={errors.email} label="Email" type="email" value={formData.email} onChange={(v) => handleFieldChange("email", v)} />
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <FormInput icon={Phone} error={errors.phone} label="Phone" value={formData.phone} onChange={(v) => handleFieldChange("phone", v)} />
                                                <FormSelect label="Gender" error={errors.gender} options={[{ value: 'm', label: 'Male' }, { value: 'f', label: 'Female' }]} onChange={(v) => handleFieldChange("gender", v as Gender)} />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <FormInput icon={Lock} error={errors.password} label="Password" type="password" onChange={(v) => handleFieldChange("password", v)} />
                                                <FormInput icon={Lock} error={errors.confirmPassword} label="Confirm" type="password" onChange={(v) => handleFieldChange("confirmPassword", v)} />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* NAV BUTTONS: Now pinned to the bottom because of flex-col + mt-auto */}
                        <div className="pt-6 md:pt-1">
                            <div className="flex gap-3">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="h-12 px-6 rounded-xl border border-input active:scale-95 transition-all flex items-center justify-center hover:bg-muted"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleAction}
                                    className={`flex-1 h-12 rounded-xl font-black transition-all flex items-center justify-center gap-2 
                                        ${!canGoNext ? "bg-primary/70 text-white/80" : "bg-primary text-white shadow-lg"}`}
                                >
                                    {loading ? "..." : step === 3 ? "Complete Sign Up" : "Next Step"}
                                </button>
                            </div>

                            {step === 1 && <SocialAuth onGoogle={handleGoogleSignUp} onFacebook={handleFacebookSignUp} />}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;