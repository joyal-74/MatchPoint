import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Navbar";
import { verifyTournamentPayment } from "../../../../features/manager/Tournaments/tournamentThunks";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { XCircle, RefreshCw, LayoutGrid, HelpCircle } from "lucide-react";

export default function PaymentFailedPage() {
    const navigate = useNavigate();
    const { tournamentId, teamId } = useParams<{ tournamentId: string, teamId: string }>();
    const dispatch = useAppDispatch();
    const managerId = useAppSelector((state) => state.auth.user?._id)

    useEffect(() => {
        if (tournamentId && teamId && managerId) {
            dispatch(verifyTournamentPayment({ managerId,  registrationId :tournamentId, paymentId : teamId, paymentStatus: "failed" }));
        }
    }, [dispatch, tournamentId, teamId, managerId]);

    const handleRetry = () => {
        navigate(`/manager/tournaments/${tournamentId}/explore`);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden">

                {/* Animated Background Elements - Using Destructive/Error colors for context */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-destructive/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-destructive/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 backdrop-blur-sm p-8 rounded-3xl text-center max-w-lg w-full">
                    
                    {/* Icon Container */}
                    <div className="relative mb-6">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                            <div className="relative">
                                <XCircle className="w-10 h-10 text-red-500 animate-pulse" strokeWidth={2.5} />
                                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <h1 className="text-3xl font-bold mb-4 text-foreground">
                        Payment Unsuccessful
                    </h1>

                    <p className="mb-8 text-muted-foreground leading-relaxed">
                        We encountered an issue processing your payment. This could be due to insufficient funds,
                        card declined, or the transaction was cancelled.
                    </p>

                    {/* Tips Section */}
                    <div className="bg-card rounded-xl p-5 mb-8 text-left border border-border shadow-sm">
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-amber-500" />
                            Quick Tips
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                                Check your card details and balance
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                                Ensure your card supports online payments
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                                Try a different payment method
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            onClick={handleRetry}
                            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 transform active:scale-95 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry Payment
                        </button>

                        <button
                            onClick={() => navigate("/manager/tournaments")}
                            className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Browse Tournaments
                        </button>
                    </div>

                    {/* Support Text */}
                    <p className="text-xs text-muted-foreground mt-8">
                        Need help?{" "}
                        <button className="text-red-500 hover:underline transition-colors font-medium">
                            Contact support
                        </button>
                    </p>

                </div>
            </div>
        </>
    );
}