import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, ArrowLeft } from 'lucide-react';

const Blocked: React.FC = () => {
    const navigate = useNavigate();
    
    const handleContactSupport = () => {
        window.location.href = 'mailto:support@yourapp.com?subject=Blocked Account Assistance';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 transition-colors duration-300">
            <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300">
                
                {/* Icon Container - Uses Destructive color to indicate error/block */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center ring-1 ring-destructive/20">
                    <ShieldAlert className="w-10 h-10 text-destructive" />
                </div>
                
                {/* Title */}
                <h1 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
                    Account Temporarily Blocked
                </h1>
                
                {/* Description */}
                <div className="space-y-2 mb-8">
                    <p className="text-muted-foreground leading-relaxed">
                        For security reasons, your account has been temporarily suspended.
                    </p>
                    <p className="text-sm text-muted-foreground/80">
                        This is usually due to multiple failed login attempts or unusual activity detected on your profile.
                    </p>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                    {/* Primary Action: Contact Support (Destructive styling for urgency) */}
                    <button
                        onClick={handleContactSupport}
                        className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-destructive/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Mail size={18} />
                        Contact Support
                    </button>
                    
                    {/* Secondary Action: Back to Login (Outline styling) */}
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-transparent border border-input text-foreground hover:bg-accent hover:text-accent-foreground font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        Back to Login
                    </button>
                </div>
                
                {/* Additional Help Footer */}
                <div className="mt-8 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                        Need immediate help? <br />
                        Email us directly at <span className="font-medium text-foreground select-all">support@yourapp.com</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Blocked;