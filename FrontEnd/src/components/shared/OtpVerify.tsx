import React, { useEffect, useState } from "react";
import { AlertCircle, Clock } from "lucide-react";

interface OtpInterface {
    otp: string;
    setOtp: (val: string) => void;
    expiresAt?: string;
    error?: string;
}

const OtpVerify: React.FC<OtpInterface> = ({ otp, setOtp, expiresAt, error }) => {
    const [remainingTime, setRemainingTime] = useState(0);

    // Timer Logic
    useEffect(() => {
        if (!expiresAt) return;
        const expiry = new Date(expiresAt).getTime();

        const updateTimer = () => {
            const now = Date.now();
            const diff = Math.max(0, expiry - now);
            setRemainingTime(diff);
            if (diff <= 0) return false; // Stop
            return true; // Continue
        };

        // Initial call
        if (!updateTimer()) return;

        const interval = setInterval(() => {
            if (!updateTimer()) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const isExpired = remainingTime <= 0;

    return (
        <div className="flex flex-col space-y-2 w-full mx-auto">
            {/* Header: Label + Timer */}
            <div className="flex justify-between items-center">
                <label htmlFor="otp" className="text-sm font-medium text-foreground">
                    One-Time Password
                </label>
                
                {expiresAt && (
                    <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 ${
                        isExpired ? "text-destructive" : "text-primary"
                    }`}>
                        <Clock size={12} />
                        <span>{isExpired ? "Expired" : formatTime(remainingTime)}</span>
                    </div>
                )}
            </div>

            {/* Input Field */}
            <div className="relative">
                <input
                    id="otp"
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => {
                        // Optional: Limit to numbers only if desired
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(val);
                    }}
                    disabled={isExpired}
                    className={`
                        flex h-10 w-full rounded-md px-3 py-2 text-sm text-center tracking-widest transition-all duration-200
                        bg-background border font-mono
                        placeholder:text-muted-foreground placeholder:tracking-normal
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
                        disabled:cursor-not-allowed disabled:opacity-50
                        ${error 
                            ? "border-destructive focus-visible:ring-destructive/50 text-destructive" 
                            : "border-input text-foreground focus-visible:border-primary focus-visible:ring-primary/30 hover:border-primary/50"
                        }
                    `}
                    maxLength={6}
                    autoComplete="one-time-code"
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-destructive animate-in slide-in-from-top-1 fade-in duration-200">
                    <AlertCircle size={12} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default OtpVerify;