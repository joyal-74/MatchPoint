import React from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailed from './PaymentFailed';

type PaymentStatus = 'success' | 'failed';

interface SubscriptionStatusPageProps {
    status: PaymentStatus;
    planName: string;
}

const SubscriptionStatusPage: React.FC<SubscriptionStatusPageProps> = ({ status, planName }) => {
    const navigate = useNavigate();

    const handleGoBack = () => navigate(-1);
    const handleGoHome = () => navigate('/dashboard');

    // Dynamic Glow Logic based on status
    const glowColor = status === 'success' 
        ? 'bg-primary/20'
        : 'bg-destructive/20';

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
            
            <div className={`absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] ${glowColor} blur-[120px] rounded-full pointer-events-none transition-colors duration-500`} />
            <div className={`absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] ${glowColor} blur-[100px] rounded-full pointer-events-none opacity-50 transition-colors duration-500`} />

            <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-500 ease-out">
                {status === 'success' ? (
                    <PaymentSuccess
                        planName={planName}
                        onGoBack={handleGoBack}
                        onGoHome={handleGoHome}
                    />
                ) : (
                    <PaymentFailed
                        planName={planName}
                        onGoBack={handleGoBack}
                        onGoHome={handleGoHome}
                    />
                )}
            </div>
        </div>
    );
};

export default SubscriptionStatusPage;