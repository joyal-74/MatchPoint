import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useLogin } from "../../hooks/useLogin";
import { FormInput } from "./SignUp/FormInput";
import SocialAuth from "./SignUp/SocialAuth";
import LoadingOverlay from "../../components/shared/LoadingOverlay";

const LoginPage: React.FC = () => {
    const {
        formData,
        errors,
        loading,
        handleFieldChange,
        handleLoginSubmit,
        handleGoogleLogin,
        handleFacebookLogin,
    } = useLogin();

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 md:p-6 relative overflow-hidden">
            <LoadingOverlay show={loading} />

            {/* Background Decorative Mesh - Matching Signup */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-[100px]" />
            </div>

            <div className="w-full min-h-[600px] max-w-[950px] bg-transparent md:bg-card border border-border rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden transition-all duration-500">

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
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="text-2xl font-bold leading-tight text-foreground">
                                    Welcome Back.
                                </h2>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                    Continue your journey and access your professional sports dashboard.
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <p className="text-xs text-muted-foreground">
                            © 2026 MatchPoint Global. <br /> Secure Professional Access.
                        </p>
                    </div>
                </div>

                {/* --- FORM SECTION --- */}
                <div className="flex-1 p-8 md:p-10 lg:p-12 bg-card flex flex-col">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleLoginSubmit(); }}
                        className="max-w-xl mx-auto w-full flex flex-col h-full"
                    >
                        <div className="flex-1">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-foreground">Login</h3>
                                <p className="text-muted-foreground text-sm">Enter your credentials to enter the arena.</p>
                            </div>

                            <div className="space-y-4">
                                <FormInput label="Email Address" icon={Mail} type="email" placeholder="Enter your email address" value={formData.email} error={errors.email} onChange={(v) => handleFieldChange("email", v)} />

                                <div className="space-y-1">
                                    <FormInput label="Password" icon={Lock} type="password" placeholder="Enter your password" value={formData.password} error={errors.password} onChange={(v) => handleFieldChange("password", v)} />
                                    <div className="flex justify-end">
                                        <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline" >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? "Authenticating..." : "Login to Account"}
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <div className="mt-6">
                                <SocialAuth onGoogle={handleGoogleLogin} onFacebook={handleFacebookLogin} />
                            </div>

                            <p className="text-center mt-8 text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-primary font-bold hover:underline">
                                    Sign up for free
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;