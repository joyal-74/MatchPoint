import React from "react";
import { AlertCircle } from "lucide-react";

interface EmailVerifyProps {
    email: string;
    setEmail: (val: string) => void;
    error: string | undefined;
}

const EmailVerify: React.FC<EmailVerifyProps> = ({ email, setEmail, error }) => {
    return (
        <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
            </label>
            
            <div className="relative">
                <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`
                        flex h-10 w-full rounded-md px-3 py-2 text-sm transition-all duration-200
                        bg-background border
                        placeholder:text-muted-foreground 
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1
                        disabled:cursor-not-allowed disabled:opacity-50
                        ${error 
                            ? "border-destructive focus-visible:ring-destructive/50 text-destructive placeholder:text-destructive/50" 
                            : "border-input text-foreground focus-visible:border-primary focus-visible:ring-primary/30 hover:border-primary/50"
                        }
                    `}
                />
            </div>

            {error && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-in slide-in-from-top-1 fade-in duration-200">
                    <AlertCircle size={12} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}

export default EmailVerify;