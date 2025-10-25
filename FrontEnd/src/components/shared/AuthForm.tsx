import React from "react";
import { FaFacebookF, FaGoogle, FaUser } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";


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
    width = "w-1/2",
    onGoogleSuccess,
}) => {

    const googleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            onGoogleSuccess(tokenResponse.code)
        },
        onError: (error) => {
            console.error('Google OAuth error:', error);
        },
        flow: 'auth-code',
        scope: 'openid email profile',
    });


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white relative overflow-hidden">

            {/* Background gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-700/20 via-neutral-900 to-neutral-900"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-emerald-500/10 to-cyan-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>

            <div className="relative flex w-[80%] max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 bg-gradient-to-b backdrop-blur-2xl h-160">
                {/* Left section */}
                <div className="w-1/2 px-12 py-16 flex flex-col justify-between">
                    <div className="mb-5">
                        <h1 className="text-[var(--color-text-primary)] text-3xl font-bold tracking-tight">
                            <span className="text-[var(--color-primary)]">M</span>atch
                            <span className="text-[var(--color-primary)]">P</span>oint
                        </h1>
                    </div>

                    <div className="space-y-9">
                        {subtitle && <h2 className="text-lg text-gray-300 mb-3">{subtitle}</h2>}
                        <div>
                            {mainHeading && (
                                <h1 className="text-5xl font-extrabold text-primary">{mainHeading}</h1>
                            )}
                            {subHeading && (
                                <h2 className="text-2xl font-semibold mt-2 text-white">{subHeading}</h2>
                            )}
                        </div>
                    </div>

                    {/* Social buttons */}
                    <div>
                        {footer && <div className="text-sm mb-4">{footer}{subfooter}</div>}

                        {showSocialButtons && (
                            <>
                                <p className="text-gray-400 text-sm mb-3">Or continue with</p>
                                <div className="flex space-x-4 text-lg">

                                    {onGoogleSuccess && (
                                        <button
                                            onClick={() => googleLogin()}
                                            className="p-2 rounded-full bg-white/10 hover:bg-green-500/10 transition flex items-center justify-center cursor-pointer"
                                        >
                                            <FaGoogle className="text-white" />
                                        </button>
                                    )}


                                    <button className="p-2 rounded-full bg-white/10 hover:bg-blue-600/10 transition flex items-center justify-center cursor-pointer">
                                        <FaFacebookF className="text-white" />
                                    </button>


                                    <button className="p-2 rounded-full bg-white/10 hover:bg-gray-500/10 transition flex items-center justify-center cursor-pointer">
                                        <FaUser className="text-white" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right section (form) */}
                <div className={`${width} pr-12 py-12 flex items-center justify-center`}>
                    <form onSubmit={onSubmit} className="w-full space-y-6">
                        <div className="space-y-5">{children}</div>

                        <button
                            type="submit"
                            className="w-full btn-primary text-white font-semibold py-3 rounded-lg transition shadow-lg hover:shadow-blue-800/50"
                        >
                            {buttonText}
                        </button>

                        {agreementText && (
                            <p className="text-gray-500 text-xs text-center">{agreementText}</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
