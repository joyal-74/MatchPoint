import React from "react";

interface EmailVerifyProps {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const EmailVerify:React.FC<EmailVerifyProps> = ({ email, setEmail }) => {
    return (
        <>
            <div className="flex flex-col text-sm">
                <label htmlFor="email" className="text-sm mb-1">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-md bg-[var(--color-surface-raised)] placeholder-gray-400 focus:outline-none"
                />
            </div>
        </>
    )
}

export default EmailVerify