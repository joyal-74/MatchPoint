import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Navbar";
import { verifyTournamentPayment } from "../../../../features/manager/Tournaments/tournamentThunks";
import { useEffect } from "react";
import { useAppDispatch } from "../../../../hooks/hooks";

export default function PaymentFailedPage() {
    const navigate = useNavigate();
    const { tournamentId, teamId } = useParams<{ tournamentId: string, teamId: string }>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (tournamentId && teamId) {
            dispatch(verifyTournamentPayment({ tournamentId, teamId, paymentStatus: "failed" }));
        }
    }, [dispatch, tournamentId, teamId]);

    const handleRetry = () => {
        navigate(`/manager/tournaments/${tournamentId}/explore`);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 text-white flex flex-col items-center justify-center">

                <div className="relative p-8 rounded-3xl text-center container w-full max-w-5xl">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                            <div className="relative">
                                <svg
                                    className="w-10 h-10 text-red-500 animate-pulse"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                        Payment Unsuccessful
                    </h1>

                    <p className="mb-8 text-neutral-300 leading-relaxed">
                        We encountered an issue processing your payment. This could be due to insufficient funds,
                        card declined, or the transaction was cancelled. Don't worry — your tournament spot is still reserved.
                    </p>

                    {/* Tips Section */}
                    <div className="bg-neutral-700/50 rounded-xl max-w-4xl p-4 mx-auto mb-6 text-left border border-neutral-600/50">
                        <h3 className="text-sm font-semibold text-neutral-200 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Quick Tips
                        </h3>
                        <ul className="text-sm text-neutral-400 space-y-1">
                            <li>• Check your card details and balance</li>
                            <li>• Ensure your card supports online payments</li>
                            <li>• Try a different payment method</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center sm:flex-row gap-3 max-w-lg text-center mx-auto">
                        <button
                            onClick={handleRetry}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-101 active:scale-95 shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Retry Payment
                        </button>

                        <button
                            onClick={() => navigate("/manager/tournaments")}
                            className="flex-1 px-6 py-3 bg-neutral-700/80 hover:bg-neutral-600/80 border border-neutral-600/50 rounded-xl text-white font-semibold transition-all duration-200 hover:border-neutral-500/50 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Browse Tournaments
                        </button>
                    </div>

                    {/* Support Text */}
                    <p className="text-xs text-neutral-500 mt-6">
                        Need help?{" "}
                        <button className="text-red-400 hover:text-red-300 underline transition-colors">
                            Contact support
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
}