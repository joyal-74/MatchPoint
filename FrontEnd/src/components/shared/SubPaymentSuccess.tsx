import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useParams, useNavigate } from 'react-router-dom';

const SuccessConfirmation = () => {
    const { planName } = useParams();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
            <div className="w-full max-w-md p-10 space-y-8">
                
                {/* Icon Section */}
                <div className="flex justify-center">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                        <CheckCircleIcon className="w-14 h-14 text-green-400" />
                    </div>
                </div>

                {/* Content Section */}
                <div className="text-center space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            Successfully Subscribed
                        </h1>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent via-green-500 to-transparent mx-auto"></div>
                    </div>
                    
                    <p className="text-neutral-400">
                        Your <span className="font-semibold text-green-400">{planName}</span> subscription is now active
                    </p>
                </div>


                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
                    >
                        Launch Dashboard
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/plans')}
                            className="flex-1 py-3 bg-transparent border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-600 rounded-lg font-medium transition-colors"
                        >
                            Plans
                        </button>
                        <button
                            onClick={() => navigate('/account')}
                            className="flex-1 py-3 bg-transparent border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-600 rounded-lg font-medium transition-colors"
                        >
                            Account
                        </button>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex justify-center gap-6 pt-6 border-t border-neutral-800">
                    <button className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
                        Help Center
                    </button>
                    <button className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
                        Billing Info
                    </button>
                    <button className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
                        FAQ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessConfirmation;