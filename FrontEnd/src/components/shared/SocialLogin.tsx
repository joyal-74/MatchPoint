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
    
    return (
        <div className={`flex gap-3 ${showGuest ? '' : 'justify-center'}`}>
            <button
                type="button"
                onClick={onGoogleLogin}
                className={`flex items-center justify-center gap-3 px-4 py-2.5 border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-all duration-200 shadow-sm ${
                    showGuest ? 'w-1/2' : 'w-full'
                }`}
            >
                <FcGoogle className="w-5 h-5" />
                <span>{googleText}</span>
            </button>

            {onGuestLogin && (
                <button
                    type="button"
                    onClick={onGuestLogin}
                    className="w-1/2 flex items-center justify-center gap-3 px-4 py-3 border border-[var(--color-border)] rounded-lg text-sm font-medium text-[var(--color-text-primary)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-all duration-200 shadow-sm"
                >
                    <FaUser className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    <span>{guestText}</span>
                </button>
            )}
        </div>
    );
};

export default SocialLogin;