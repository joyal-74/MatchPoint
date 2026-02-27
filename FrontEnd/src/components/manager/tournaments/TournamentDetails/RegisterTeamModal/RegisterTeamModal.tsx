import { X, CreditCard } from "lucide-react";
import TeamSelect from "./TeamSelect";
import CaptainSelect from "./CaptainSelect";
import PaymentMethodSelect from "./PaymentMethodSelect";
import type { Tournament } from "../../../../../features/manager/managerTypes";
import type { Team } from "../../../teams/Types";
import { useRegisterTeam } from "../../../../../hooks/manager/useRegisterTeam";
import { PaymentSummary } from "./PaymentSummary";
import { TermsCheckbox } from "./TermsCheckbox";

interface RegisterTeamModalProps {
    show: boolean;
    onClose: () => void;
    entryFee: number;
    tournament: Tournament;
    teams: Team[];
    managerId: string;
}

export default function RegisterTeamModal({ show, onClose, entryFee, tournament, teams, managerId }: RegisterTeamModalProps) {
    const {
        loading, selectedTeam, selectedCaptain, selectedPayment, agree,
        setSelectedTeam, setSelectedCaptain, setSelectedPayment, setAgree, handlePayment,
    } = useRegisterTeam(entryFee, tournament, managerId, onClose);

    if (!show) return null;

    const selectedTeamData = teams.find((t) => t._id === selectedTeam);

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden transition-all duration-300">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-border bg-muted/30">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Register Tournament</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">{tournament.title}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <TeamSelect teams={teams} selectedTeam={selectedTeam} onSelect={setSelectedTeam} />
                    
                    {selectedTeam && (
                        <CaptainSelect team={selectedTeamData} selectedCaptain={selectedCaptain} onSelect={setSelectedCaptain} />
                    )}
                    
                    <PaymentMethodSelect selectedPayment={selectedPayment} onSelect={setSelectedPayment} />
                    
                    <div className="pt-2">
                        <PaymentSummary entryFee={entryFee} />
                        <TermsCheckbox agree={agree} onToggle={() => setAgree(!agree)} />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-6 py-4 border-t border-border bg-muted/20">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Cancel
                    </button>

                    <button
                        disabled={!selectedTeam || !selectedCaptain || !agree || loading}
                        onClick={handlePayment}
                        className="px-8 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <CreditCard size={18} />
                                <span>Pay ₹{entryFee}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}