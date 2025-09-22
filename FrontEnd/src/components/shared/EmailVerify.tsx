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
                    className={`w-full p-3 rounded-md bg-[var(--color-surface-raised)] placeholder-gray-400 focus:outline-none ${error ? "border border-red-500" : "border border-transparent"}`}
                />
                {error && ( <p className="text-red-500 text-xs mt-1 text-start">{error}</p> )}
            </div>
        </>
    )
}

export default EmailVerify