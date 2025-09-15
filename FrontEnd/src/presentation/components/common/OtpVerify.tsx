import React, { useEffect, useState } from "react";

interface otpInterface {
    otp: string;
    setOtp: React.Dispatch<React.SetStateAction<string>>;
    expiresAt?: string;
    error?: string;
}

const OtpVerify: React.FC<otpInterface> = ({ otp, setOtp, expiresAt, error }) => {
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        if (!expiresAt) return;

        const expiry = new Date(expiresAt).getTime();

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = Math.max(0, expiry - now);
            setRemainingTime(diff);

            if (diff <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);


    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex flex-col text-sm max-w-xs w-full mx-auto">
            <label htmlFor="otp" className="text-sm text-center mb-1">
                One-Time Password
            </label>
            <input
                id="otp"
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`w-full p-3 rounded-md tracking-widest text-center text-lg font-bold bg-[var(--color-surface-raised)] placeholder-gray-400 focus:outline-none ${error ? "border border-red-500" : ""
                    }`}
            />
            <div>
                {error && (
                    <p className="text-red-500 text-xs mt-1 text-center">{error}</p>
                )}
                <h1 className="text-center text-sm text-[var(--color-primary-text)]">
                    {remainingTime > 0 ? formatTime(remainingTime) : <span className="text-[var(--color-error-text)]">Expired</span>}
                </h1>
            </div>
        </div>
    );
};

export default OtpVerify;