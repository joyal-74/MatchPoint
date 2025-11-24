import React from "react";

interface EmailVerifyProps {
    email: string;
    setEmail: (val: string) => void;
    error: string | undefined;
}

const EmailVerify: React.FC<EmailVerifyProps> = ({ email, setEmail, error }) => {
    return (
        <>
            <div className="flex flex-col text-sm">
                <label htmlFor="email" className="text-sm mb-1"> Email </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`p-3 rounded-lg bg-[var(--color-surface-raised)]/20 
                    placeholder-[var(--color-text-tertiary)] 
                    border transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50
                    disabled:opacity-50 disabled:cursor-not-allowed border-[var(--color-border)] 
                    hover:border-[var(--color-primary)] hover:border-opacity-50
                    ${error ? "border border-red-500" : "border border-transparent"}`}
                />
                {error && (<p className="text-red-500 text-xs mt-1 text-start border-red-500 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-50">{error}</p>)}
            </div>
        </>
    )
}

export default EmailVerify