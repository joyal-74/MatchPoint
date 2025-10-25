import React, { useEffect, useState } from "react";

interface OtpInterface {
    otp: string;
    setOtp: (val: string) => void;
    expiresAt?: string;
    error?: string;
}

const OtpVerify: React.FC<OtpInterface> = ({ otp, setOtp, expiresAt, error }) => {
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        if (!expiresAt) return;
        const expiry = new Date(expiresAt).getTime();

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = Math.max(0, expiry - now);
            setRemainingTime(diff);
            if (diff <= 0) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const isExpired = remainingTime <= 1000;

    return (
        <div className="flex flex-col text-sm w-full mx-auto">
            <div className="flex justify-between items-center mb-1">
                <label htmlFor="otp" className="text-sm">
                    One-Time Password
                </label>
                <span
                    className={`text-xs font-medium ${
                        isExpired
                            ? "text-[var(--color-error-text)]"
                            : "text-[var(--color-primary-text)]"
                    }`}
                >
                    {isExpired ? "Expired" : formatTime(remainingTime)}
                </span>
            </div>

            <input
                id="otp"
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`p-3 rounded-lg bg-[var(--color-surface-raised)]/20 
                    placeholder-[var(--color-text-tertiary)] 
                    border transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50
                    disabled:opacity-50 disabled:cursor-not-allowed 
                    border-[var(--color-border)] hover:border-[var(--color-primary)] hover:border-opacity-50
                    ${error ? "border border-red-500" : "border border-transparent"}`}
            />

            {error && (
                <p className="text-red-500 text-xs mt-1 text-center">{error}</p>
            )}
        </div>
    );
};

export default OtpVerify;