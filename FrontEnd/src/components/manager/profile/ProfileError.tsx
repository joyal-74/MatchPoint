import { AlertCircle, RefreshCw } from "lucide-react";
import ManagerLayout from '../../../pages/layout/ManagerLayout';

interface ProfileErrorProps {
    error: string | null;
    onAction: () => void;
}

const ProfileError = ({ error, onAction }: ProfileErrorProps) => {
    // Return null if no error exists, so the component renders nothing
    if (!error) return null;

    return (
        <ManagerLayout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 animate-in fade-in zoom-in-95 duration-300">
                
                {/* Error Card Container */}
                <div className="max-w-md w-full bg-card text-card-foreground border border-border rounded-xl shadow-lg p-8 text-center">
                    
                    {/* Destructive Icon with Ring */}
                    <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-destructive/20">
                        <AlertCircle className="w-8 h-8 text-destructive" strokeWidth={2} />
                    </div>

                    {/* Error Content */}
                    <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight">
                        Unable to Load Profile
                    </h2>
                    
                    <p className="text-muted-foreground text-sm mb-8 leading-relaxed px-4">
                        We encountered an issue while fetching your profile data.
                        <br />
                        <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded mt-2 inline-block text-destructive">
                            Error: {error}
                        </span>
                    </p>

                    {/* Retry Action */}
                    <button
                        onClick={onAction}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-all shadow-md shadow-primary/20 active:scale-95 group"
                    >
                        <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                        Try Again
                    </button>
                </div>

            </div>
        </ManagerLayout>
    );
}

export default ProfileError;