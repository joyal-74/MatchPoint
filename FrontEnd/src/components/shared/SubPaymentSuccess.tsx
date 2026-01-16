import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Home, CreditCard } from 'lucide-react';

const SuccessConfirmation = () => {
    const { planName } = useParams();
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);

    // Trigger simple entrance animation
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
            
            {/* 1. Ambient Background Glows */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Main Card Container */}
            <div className={`
                relative w-full max-w-md bg-neutral-900/60 backdrop-blur-xl 
                border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50
                transform transition-all duration-700 ease-out
                ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
            `}>
                
                {/* Success Icon with Pulse Effect */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-500 blur-xl opacity-40 rounded-full animate-pulse"></div>
                        <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                            <Check className="w-10 h-10 text-white" strokeWidth={3} />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-2 mb-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Payment Successful!
                    </h1>
                    <p className="text-neutral-400 text-sm">
                        Thank you for your purchase. Your account has been upgraded instantly.
                    </p>
                </div>

                {/* Subscription "Receipt" Card */}
                <div className="bg-neutral-800/50 border border-white/5 rounded-2xl p-5 mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">Plan Activated</p>
                        <p className="text-lg font-bold text-white capitalize">{planName || 'Premium'} Tier</p>
                    </div>
                    <div className="h-10 w-10 bg-neutral-700/50 rounded-full flex items-center justify-center text-green-400">
                        <CreditCard size={20} />
                    </div>
                </div>

                {/* Primary Action */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="group w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 mb-6"
                >
                    Launch Dashboard
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Secondary Actions (Grid Layout) */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => navigate('/account')}
                        className="py-3 px-4 bg-neutral-800/30 hover:bg-neutral-800 text-neutral-300 hover:text-white text-sm font-medium rounded-xl border border-white/5 hover:border-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                        <Home size={16} />
                        My Account
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SuccessConfirmation;