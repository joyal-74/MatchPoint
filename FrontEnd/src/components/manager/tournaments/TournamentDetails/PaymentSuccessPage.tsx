import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Navbar";


export default function PaymentSuccessPage() {
    const { tournamentId } = useParams<{ tournamentId: string}>();
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-white flex flex-col items-center justify-center p-6">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-600/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative backdrop-blur-sm p-8 rounded-3xl text-center max-w-5xl w-full">
                    {/* Icon Container with Animation */}
                    <div className="relative mb-6">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                            <div className="relative">
                                <svg
                                    className="w-10 h-10 text-green-500 animate-pulse"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                            </div>
                        </div>


                    </div>

                    {/* Content */}
                    <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                        Payment Successful!
                    </h1>

                    <p className="mb-8 text-neutral-300 leading-relaxed">
                        Your team has been registered successfully. You're all set to participate in the tournament.
                        We've sent a confirmation email with all the details.
                    </p>

                    {/* Success Details */}
                    <div className="bg-neutral-700/50 rounded-xl p-4 mb-6 text-left border border-neutral-600/50">
                        <h3 className="text-sm font-semibold text-neutral-200 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Registration Confirmed
                        </h3>
                        <ul className="text-sm text-neutral-400 space-y-1">
                            <li>• Team registration completed</li>
                            <li>• Payment processed successfully</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 max-w-lg text-center mx-auto">
                        <button
                            onClick={() => navigate(`/manager/tournaments/${tournamentId}/explore`)}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-101 active:scale-100 shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Tournament
                        </button>

                        <button
                            onClick={() => navigate("/manager/tournaments")}
                            className="flex-1 px-6 py-3 bg-neutral-700/80 hover:bg-neutral-600/80 border border-neutral-600/50 rounded-xl text-white font-semibold transition-all duration-200 hover:border-neutral-500/50 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Browse More
                        </button>
                    </div>

                    {/* Support Text */}
                    <p className="text-xs text-neutral-500 mt-6">
                        Questions?{" "}
                        <button className="text-green-400 hover:text-green-300 underline transition-colors">
                            Contact support
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
}