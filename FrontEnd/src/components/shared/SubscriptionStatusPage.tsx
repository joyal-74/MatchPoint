import React from 'react';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailed from './PaymentFailed';

type PaymentStatus = 'success' | 'failed';

// Define the component's props
interface SubscriptionStatusPageProps {
    status: PaymentStatus;
    planName: string;
}

const SubscriptionStatusPage: React.FC<SubscriptionStatusPageProps> = ({ status, planName }) => {
    const handleGoBack = () => {
        window.history.back();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-8 transition-all duration-300 ease-in-out">

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