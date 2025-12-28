import React from "react";
import { FaFacebookF, FaGoogle, FaUser } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";

interface AuthFormProps {
    title?: string;
    subtitle?: string;
    mainHeading?: React.ReactNode;
    subHeading?: string;
    onSubmit: (e: React.FormEvent) => void;
    buttonText: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    subfooter?: React.ReactNode;
    showSocialButtons?: boolean;
    agreementText?: string;
    width?: string;
    onGoogleSuccess?: (token: string) => void;
    onFacebookSuccess?: (token: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
    subtitle,
    mainHeading,
    subHeading,
    onSubmit,
    buttonText,
    children,
    footer,
    subfooter,
    showSocialButtons = true,
    agreementText,
    width = "w-full md:w-1/2",
    onGoogleSuccess,
    onFacebookSuccess,
}) => {

    const googleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            if (onGoogleSuccess) {
                onGoogleSuccess(tokenResponse.code)
            }
        },
        onError: (error) => {
            console.error('Google OAuth error:', error);
        },
        flow: 'auth-code',
        scope: 'openid email profile',
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground relative overflow-hidden transition-colors duration-300">

            {/* Background Ambient Glow (Theme Aware) */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/30 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>

            {/* Main Card */}
            <div className="relative flex flex-col md:flex-row w-[90%] max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-border bg-card/50 backdrop-blur-md min-h-[600px]">
                
                {/* Left Section (Branding & Socials) */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-muted/30 border-b md:border-b-0 md:border-r border-border">
                    <div className="mb-5">
                        <h1 className="text-3xl font-bold font-rowdies tracking-wide text-foreground">
                            <span className="text-primary">M</span>atch
                            <span className="text-primary">P</span>oint
                        </h1>
                    </div>

                    <div className="space-y-6 my-auto">
                        {subtitle && (
                            <h2 className="text-lg font-medium text-muted-foreground">
                                {subtitle}
                            </h2>
                        )}
                        <div>
                            {mainHeading && (
                                <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-tight">
                                    {mainHeading}
                                </h1>
                            )}
                            {subHeading && (
                                <h2 className="text-xl md:text-2xl font-semibold mt-3 text-foreground">
                                    {subHeading}
                                </h2>
                            )}
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="mt-8">
                        {footer && <div className="text-sm mb-6 text-muted-foreground">{footer}{subfooter}</div>}

                        {showSocialButtons && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                                <p className="text-muted-foreground text-sm mb-4">Or continue with</p>
                                <div className="flex gap-4">

                                    {onGoogleSuccess && (
                                        <button
                                            type="button"
                                            onClick={() => googleLogin()}
                                            className="
                                                flex items-center justify-center w-12 h-12 rounded-full 
                                                bg-background border border-border shadow-sm
                                                hover:border-primary hover:text-primary hover:bg-primary/5 
                                                transition-all duration-200 cursor-pointer
                                            "
                                            title="Sign in with Google"
                                        >
                                            <FaGoogle className="text-lg" />
                                        </button>
                                    )}

                                    <FacebookLogin
                                        appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                                        onSuccess={(response) => {
                                            const accessToken = response?.accessToken;
                                            if (onFacebookSuccess && accessToken) {
                                                onFacebookSuccess(accessToken);
                                            }
                                        }}
                                        onFail={(error) => console.error("Facebook error:", error)}
                                        render={({ onClick }) => (
                                            <button
                                                type="button"
                                                onClick={onClick}
                                                className="
                                                    flex items-center justify-center w-12 h-12 rounded-full 
                                                    bg-background border border-border shadow-sm
                                                    hover:border-blue-600 hover:text-blue-600 hover:bg-blue-600/5
                                                    transition-all duration-200 cursor-pointer
                                                "
                                                title="Sign in with Facebook"
                                            >
                                                <FaFacebookF className="text-lg" />
                                            </button>
                                        )}
                                    />

                                    {/* Guest/Demo User Button */}
                                    <button 
                                        type="button"
                                        className="
                                            flex items-center justify-center w-12 h-12 rounded-full 
                                            bg-background border border-border shadow-sm
                                            hover:border-foreground hover:text-foreground hover:bg-muted
                                            transition-all duration-200 cursor-pointer text-muted-foreground
                                        "
                                        title="Continue as Guest"
                                    >
                                        <FaUser className="text-lg" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section (Form) */}
                <div className={`${width} p-8 md:p-12 flex items-center justify-center bg-card`}>
                    <form onSubmit={onSubmit} className="w-full space-y-6">
                        <div className="space-y-5">
                            {children}
                        </div>

                        <button
                            type="submit"
                            className="
                                w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200
                                bg-primary text-primary-foreground shadow-lg shadow-primary/20
                                hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.99]
                            "
                        >
                            {buttonText}
                        </button>

                        {agreementText && (
                            <p className="text-muted-foreground text-xs text-center leading-relaxed px-4">
                                {agreementText}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;