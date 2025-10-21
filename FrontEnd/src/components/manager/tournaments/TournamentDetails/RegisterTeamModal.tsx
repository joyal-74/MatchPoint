import { X, CreditCard, Crown, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { paymentInitiate, verifyTournamentPayment } from "../../../../features/manager/Tournaments/tournamentThunks";
import type { Tournament } from "../../../../features/manager/managerTypes";
import { toast } from "react-toastify";
import type { Team } from "../../../manager/teams/Types"
import { useNavigate } from "react-router-dom";


interface RegisterTeamModalProps {
    show: boolean;
    onClose: () => void;
    entryFee: number;
    tournament: Tournament;
    teams: Team[];
    managerId: string;
}


type PaymentMethod = "razorpay" | "wallet";

export default function RegisterTeamModal({ show, onClose, entryFee, tournament, teams, managerId }: RegisterTeamModalProps) {
    const [selectedTeam, setSelectedTeam] = useState<string>("");
    const [selectedCaptain, setSelectedCaptain] = useState<string>("");
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("razorpay");
    const [agree, setAgree] = useState(false);
    const { loading, error } = useAppSelector(state => state.managerTournaments);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);


    if (!show) return null;

    const selectedTeamData = teams.find(team => team._id === selectedTeam);
    const availablePlayers = selectedTeamData?.members || [];

    async function loadRazorpayScript(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (window.Razorpay) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
            document.body.appendChild(script);
        });
    }

    async function handlePayment() {
        if (selectedPayment === 'razorpay') {
            await loadRazorpayScript();
        }
        const result = await dispatch(
            paymentInitiate({
                tournamentId: tournament._id,
                teamId: selectedTeam,
                captainId: selectedCaptain,
                managerId,
                paymentMethod: selectedPayment,
            })
        ).unwrap();

        if (selectedPayment === 'razorpay' && result.orderId) {
            const options = {
                key: result.keyId,
                amount: entryFee * 100,
                currency: 'INR',
                order_id: result.orderId,
                handler: async (response: { razorpay_payment_id: string }) => {
                    await dispatch(
                        verifyTournamentPayment({
                            registrationId: result.registrationId,
                            paymentId: response.razorpay_payment_id,
                            paymentStatus: 'completed'
                        })
                    ).unwrap();
                    navigate(`/manager/tournaments/${tournament._id}/${selectedTeam}/payment-success`)
                    onClose();
                },
                prefill: {
                    name: selectedTeamData?.name,
                },
                theme: { color: '#3399cc' },
            };
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', () => {
                navigate(`/manager/tournaments/${tournament._id}/${selectedTeam}/payment-failed`)
            });
            rzp.open();
        } else if (selectedPayment === 'wallet') {
            await dispatch(
                verifyTournamentPayment({
                    registrationId: result.registrationId,
                    paymentId: result.paymentSessionId,
                    paymentStatus: 'completed'
                })
            ).unwrap();
            toast.success('Payment deducted from wallet!');
            onClose();
        }
    }

    const paymentMethods = [
        {
            id: "razorpay" as PaymentMethod,
            name: "UPI & Net Banking",
            description: "Pay with Razorpay",
            color: "from-green-800 to-green-850"
        },
        {
            id: "wallet" as PaymentMethod,
            name: "Wallet Balance",
            description: "Use your wallet",
            color: "from-green-800 to-green-850"
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 border border-neutral-700/50 rounded-2xl shadow-2xl shadow-black/50 w-full max-w-3xl">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-700/50">
                    <div>
                        <h2 className="text-xl font-bold text-white">Register for Tournament</h2>
                        <p className="text-sm text-neutral-400 mt-1">{tournament.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-800 rounded-xl transition-colors text-neutral-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-3">
                            <Users size={16} />
                            Select Your Team
                        </label>
                        <select
                            className="w-full p-3 rounded-md bg-neutral-800 border border-neutral-700 text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                            value={selectedTeam}
                            onChange={(e) => {
                                setSelectedTeam(e.target.value);
                                setSelectedCaptain("");
                            }}
                        >
                            <option value="">Choose your Team</option>
                            {teams.map((team) => (
                                <option key={team._id} value={team._id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Captain Selection */}
                    {selectedTeam && (
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-3">
                                <Crown size={16} className="text-yellow-500" />
                                Select Captain
                            </label>
                            <select
                                className="w-full p-3 rounded-md bg-neutral-800 border border-neutral-700 text-white text-sm focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                                value={selectedCaptain}
                                onChange={(e) => setSelectedCaptain(e.target.value)}
                            >
                                <option value="">Choose a player as Captain</option>
                                {availablePlayers.map((player) => (
                                    <option key={player.userId} value={player.userId}>
                                        {`${player.firstName} ${player.lastName}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-3">
                            Payment Method
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {paymentMethods.map((method) => (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedPayment(method.id)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${selectedPayment === method.id
                                        ? `border-green-500 bg-gradient-to-r ${method.color}/20`
                                        : "border-neutral-700 bg-neutral-800 hover:border-neutral-600"
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <div className="font-semibold text-sm text-white">{method.name}</div>
                                        </div>
                                        {selectedPayment === method.id && (
                                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-neutral-400">Entry Fee:</span>
                            <span className="text-2xl font-bold text-green-400">₹{entryFee}</span>
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-3">
                        <input
                            id="agree"
                            type="checkbox"
                            checked={agree}
                            onChange={() => setAgree(!agree)}
                            className="w-5 h-5 mt-0.5 accent-green-500 rounded focus:ring-green-500 focus:ring-2"
                        />
                        <label htmlFor="agree" className="text-sm text-neutral-400 leading-relaxed">
                            I agree to the{" "}
                            <span className="text-green-400 hover:underline cursor-pointer font-medium">
                                tournament rules and regulations.
                            </span>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center px-6 py-4 border-t border-neutral-700/50 bg-neutral-800/30 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-neutral-600 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all font-medium"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!selectedTeam || !selectedCaptain || !agree || loading}
                        onClick={handlePayment}
                        className={`px-8 py-2.5 rounded-xl text-white font-semibold transition-all flex items-center gap-2 ${!selectedTeam || !selectedCaptain || !agree || loading
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