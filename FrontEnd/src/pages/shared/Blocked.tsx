import { useNavigate } from 'react-router-dom';

const Blocked: React.FC = () => {
    const navigate = useNavigate();
    
    const handleContactSupport = () => {
        // You can replace this with actual support contact logic
        window.location.href = 'mailto:support@yourapp.com?subject=Blocked Account Assistance';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-800 px-4">
            <div className="max-w-md w-full bg-neutral-800 rounded-2xl shadow-xl border border-neutral-700 p-8 text-center">
                {/* Icon Container */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-900/20 flex items-center justify-center">
                    <div className="text-3xl">🔒</div>
                </div>
                
                {/* Title */}
                <h1 className="text-2xl font-bold text-white mb-3">
                    Account Temporarily Blocked
                </h1>
                
                {/* Description */}
                <p className="text-gray-300 mb-2 leading-relaxed">
                    For security reasons, your account has been temporarily suspended.
                </p>
                <p className="text-gray-300 mb-8 leading-relaxed">
                    This may be due to multiple failed login attempts or suspicious activity.
                </p>
                
                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={handleContactSupport}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Contact Support
                    </button>
                    
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full border border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-200 font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Back to Login
                    </button>
                </div>
                
                {/* Additional Help */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                    <p className="text-sm text-gray-400">
                        Need immediate help? <br />
                        Email us at <span className="font-medium text-gray-300">support@yourapp.com</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Blocked;