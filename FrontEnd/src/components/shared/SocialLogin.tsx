import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaUser } from "react-icons/fa";

interface SocialLoginProps {
    onGoogleLogin: () => void;
    onGuestLogin?: () => void; 
    googleText?: string;
    guestText?: string;
}

const SocialLogin: React.FC<SocialLoginProps> = ({
    onGoogleLogin,
    onGuestLogin,
    googleText = "Google",
    guestText = "Guest"
}) => {
    const showGuest = Boolean(onGuestLogin);
    
    // Semantic class strings for reusability
    const buttonBaseClass = "flex items-center justify-center gap-3 px-4 py-2.5 border border-input rounded-lg text-sm font-medium bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm active:scale-95";

    return (
        <div className={`flex gap-3 ${showGuest ? '' : 'justify-center'}`}>
            <button
                type="button"
                onClick={onGoogleLogin}
                className={`${buttonBaseClass} ${showGuest ? 'w-1/2' : 'w-full'}`}
            >
                <FcGoogle className="w-5 h-5 shrink-0" />
                <span>{googleText}</span>
            </button>

            {onGuestLogin && (
                <button
                    type="button"
                    onClick={onGuestLogin}
                    className={`${buttonBaseClass} w-1/2`}
                >
                    <FaUser className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>{guestText}</span>
                </button>
            )}
        </div>
    );
};

export default SocialLogin;