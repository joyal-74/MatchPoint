import { X, CreditCard } from "lucide-react";
import TeamSelect from "./TeamSelect";
import CaptainSelect from "./CaptainSelect";
import PaymentMethodSelect from "./PaymentMethodSelect";
import PaymentSummary from "./PaymentSummary";
import TermsCheckbox from "./TermsCheckbox";
import type { Tournament } from "../../../../../features/manager/managerTypes";
import type { Team } from "../../../teams/Types";
import { useRegisterTeam } from "../../../../../hooks/manager/useRegisterTeam";

interface RegisterTeamModalProps {
    show: boolean;
    onClose: () => void;
    entryFee: number;
    tournament: Tournament;
    teams: Team[];
    managerId: string;
}

export default function RegisterTeamModal({
    show,
    onClose,
    entryFee,
    tournament,
    teams,
    managerId,
}: RegisterTeamModalProps) {
    const {
        loading,
        selectedTeam,
        selectedCaptain,
        selectedPayment,
        agree,
        setSelectedTeam,
        setSelectedCaptain,
        setSelectedPayment,
        setAgree,
        handlePayment,
    } = useRegisterTeam(entryFee, tournament, managerId, onClose);

    if (!show) return null;

    const selectedTeamData = teams.find((t) => t._id === selectedTeam);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 border border-neutral-700/50 rounded-2xl shadow-2xl w-full max-w-3xl">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-700/50">
                    <div>
                        <h2 className="text-xl font-bold text-white">Register for Tournament</h2>
                        <p className="text-sm text-neutral-400 mt-1">{tournament.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <TeamSelect teams={teams} selectedTeam={selectedTeam} onSelect={setSelectedTeam} />
                    <CaptainSelect team={selectedTeamData} selectedCaptain={selectedCaptain} onSelect={setSelectedCaptain} />
                    <PaymentMethodSelect selectedPayment={selectedPayment} onSelect={setSelectedPayment} />
                    <PaymentSummary entryFee={entryFee} />
                    <TermsCheckbox agree={agree} onToggle={() => setAgree(!agree)} />
                </div>

                <div className="flex justify-between items-center px-6 py-4 border-t border-neutral-700/50 bg-neutral-800/30 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-neutral-600 text-neutral-300 hover:bg-neutral-800"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!selectedTeam || !selectedCaptain || !agree || loading}
                        onClick={handlePayment}
                        className={`px-8 py-2.5 rounded-xl text-white font-semibold flex items-center gap-2 ${
                            !selectedTeam || !selectedCaptain || !agree || loading
                                ? "bg-green-600/30 cursor-not-allowed text-green-400/70"
                                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                        }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard size={18} />
                                Pay ₹{entryFee}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
