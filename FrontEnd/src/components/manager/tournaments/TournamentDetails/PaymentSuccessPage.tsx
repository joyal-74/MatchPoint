import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../Navbar";
import { Check, ArrowRight, LayoutGrid, CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
    const { tournamentId } = useParams<{ tournamentId: string }>();
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden">
                
                {/* Animated Background Elements - Using Primary Color for Theme Consistency */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 backdrop-blur-sm p-8 rounded-3xl text-center max-w-lg w-full">
                    
                    {/* Icon Container with Animation */}
                    <div className="relative mb-6">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                            <div className="relative">
                                <Check className="w-10 h-10 text-green-500 animate-pulse" strokeWidth={3} />
                                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <h1 className="text-3xl font-bold mb-4 text-foreground">
                        Payment Successful!
                    </h1>

                    <p className="mb-8 text-muted-foreground leading-relaxed">
                        Your team has been registered successfully. You're all set to participate in the tournament.
                        We've sent a confirmation email with all the details.
                    </p>

                    {/* Success Details Card */}
                    <div className="bg-card rounded-xl p-5 mb-8 text-left border border-border shadow-sm">
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            Registration Confirmed
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                                Team registration completed
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                                Payment processed successfully
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            onClick={() => navigate(`/manager/tournaments/${tournamentId}/explore`)}
                            className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold transition-all duration-200 transform active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            <LayoutGrid className="w-4 h-4" />
                            View Tournament
                        </button>

                        <button
                            onClick={() => navigate("/manager/tournaments")}
                            className="flex-1 px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <ArrowRight className="w-4 h-4" />
                            Browse More
                        </button>
                    </div>

                    {/* Support Text */}
                    <p className="text-xs text-muted-foreground mt-8">
                        Questions?{" "}
                        <button className="text-primary hover:underline transition-colors font-medium">
                            Contact support
                        </button>
                    </p>
                </div>
            </div>
        </>
    );
}