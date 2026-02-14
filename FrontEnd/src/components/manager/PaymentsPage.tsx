import { useState, useEffect, useMemo } from "react";
import { Wallet, History, ArrowUpRight } from "lucide-react";
import ManagerLayout from "../../pages/layout/ManagerLayout";
import LoadingOverlay from "../../components/shared/LoadingOverlay";
import { createRazorpayOrder, deletePayoutMethod, fetchFinancialReport, fetchPayoutMethods, initiateWithdrawal, saveNewAccountMethod, verifyPayment } from "../../features/manager/financials/financialThunk";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

// Import Modular Components
import { WalletHeaderCard } from "./wallet/WalletHeaderCard";
import { PayoutMethods } from "./wallet/PayoutMethods";
import { TransactionList } from "./wallet/TransactionList";
import { DepositModal } from "./wallet/DepositModal";
import { AddPaymentMethodModal } from "./wallet/AddPaymentMethodModal";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "../../utils/apiError";
import type { SavePayoutMethodPayload } from "../../features/manager/financials/financialTypes";
import ConfirmTeamModal from "../shared/modal/ConfirmTeamModal";
import { useRazorpayGateway } from "../../hooks/useRazorpayGateway";
import { useNavigate } from "react-router-dom";
import { WithdrawalModal } from "./wallet/WithdrawalModal";

export default function FinancialsPage() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const { transactions, balance, payoutMethods, loading } = useAppSelector((state) => state.financials);
    const managerId = user?._id;
    const { initiatePayment } = useRazorpayGateway();

    const [showDeposit, setShowDeposit] = useState(false);
    const [showAddMethod, setShowAddMethod] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [showWithdrawal, setShowWithdrawal] = useState(false);

    useEffect(() => {
        if (managerId) {
            dispatch(fetchFinancialReport(managerId));
            dispatch(fetchPayoutMethods(managerId));
        }
    }, [dispatch, managerId]);


    const handleSaveNewMethod = async (newMethod: SavePayoutMethodPayload) => {
        if (!managerId) return;

        try {
            await dispatch(saveNewAccountMethod({
                managerId,
                payload: newMethod
            })).unwrap();

            toast.success("Payout method saved successfully");
            setShowAddMethod(false);

            dispatch(fetchPayoutMethods(managerId));
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error) || 'Failed to save payout method');
            console.error("Failed to save method", error);
        }
    };

    const openDeleteConfirmation = (payoutId: string) => {
        setConfirmDeleteId(payoutId);
    };

    const handleDeleteMethod = async () => {
        if (!managerId || !confirmDeleteId) return;

        try {
            await dispatch(deletePayoutMethod({
                managerId,
                payoutId: confirmDeleteId
            })).unwrap();

            toast.success("Account removed");
            setConfirmDeleteId(null);
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error) || 'Failed to remove account');
        }
    };

    const handleDeposit = async (amount: string, method: string) => {
        if (method !== 'razorpay') return;

        try {
            const order = await dispatch(createRazorpayOrder({
                amount: Number(amount),
                userId: managerId!
            })).unwrap();

            initiatePayment(
                {
                    key: order.key,
                    amount: order.amount,
                    currency: "INR",
                    order_id: order.id,
                    name: "MatchPoint Wallet",
                    description: `Adding ₹${amount} to wallet`,
                    themeColor: "#3B82F6",
                    prefill: {
                        name: user?.firstName,
                        email: user?.email,
                    }
                },
                async (response) => {
                    try {
                        await dispatch(verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId: managerId!,
                            amount: Number(amount),
                        })).unwrap();

                        toast.success("Money added to wallet!");
                        setShowDeposit(false);
                        dispatch(fetchFinancialReport(managerId!));
                    } catch (err) {
                        console.log(err)
                        toast.error("Signature verification failed.");
                    }
                },
                (error) => {
                    toast.error(getApiErrorMessage(error) || "Payment failed");
                }
            );
        } catch (error) {
            console.log(error)
            toast.error("Could not create payment order");
        }
    };

    const MIN_WITHDRAWAL = 100;
    const RECENT_LIMIT = 7;


    const recentTransactions = useMemo(() => {
        return transactions.slice(0, RECENT_LIMIT);
    }, [transactions]);

    const handleViewFullHistory = () => {
        navigate('/manager/payments/history');
    };

    const handleWithdraw = async (payoutData: string | SavePayoutMethodPayload, amount: number) => {
        if (!managerId) return;

        try {
            await dispatch(initiateWithdrawal({
                managerId,
                payoutData,
                amount
            })).unwrap();

            toast.success("Withdrawal initiated successfully!");
            setShowWithdrawal(false);

            dispatch(fetchFinancialReport(managerId));
            dispatch(fetchPayoutMethods(managerId));

        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error) || 'Withdrawal failed');
        }
    };

    return (
        <ManagerLayout>
            <LoadingOverlay show={loading} />

            <div className="bg-background transition-colors">
                {/* Header */}
                <div className="bg-card border-b border-border sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
                                <Wallet size={20} />
                            </div>
                            <h1 className="font-bold text-xl text-foreground tracking-tight">My Wallet</h1>
                        </div>
                        {/* Redirects to Full History */}
                        <button
                            onClick={handleViewFullHistory}
                            className="h-10 w-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all group"
                            title="View Full History"
                        >
                            <History size={18} className="group-hover:rotate-[-10deg] transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 pt-8 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* LEFT SIDE: Sticky Controls */}
                        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                            <WalletHeaderCard
                                balance={balance}
                                minLimit={MIN_WITHDRAWAL}
                                onWithdraw={() => setShowWithdrawal(true)}
                                onAddMoney={() => setShowDeposit(true)}
                                canWithdraw={balance >= MIN_WITHDRAWAL}
                            />
                            <PayoutMethods
                                methods={payoutMethods}
                                onDelete={openDeleteConfirmation}
                                onAddNew={() => setShowAddMethod(true)}
                            />
                        </div>

                        {/* RIGHT SIDE: Recent Activity */}
                        <div className="lg:col-span-8 flex flex-col gap-4">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="font-bold text-lg text-foreground">Recent Transactions</h2>
                                <span className="text-xs text-muted-foreground font-medium">
                                    Showing {recentTransactions.length} of {transactions.length}
                                </span>
                            </div>

                            <div className="bg-card overflow-hidden">
                                <TransactionList
                                    transactions={recentTransactions}
                                />

                                {transactions.length > RECENT_LIMIT && (
                                    <button
                                        onClick={handleViewFullHistory}
                                        className="w-full py-4 bg-muted/30 hover:bg-muted/50 text-primary text-sm font-bold transition-colors border-t border-border flex items-center justify-center gap-2"
                                    >
                                        View All Transactions <ArrowUpRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showDeposit && (
                <DepositModal
                    onClose={() => setShowDeposit(false)}
                    onProceed={handleDeposit}
                />
            )}

            {showAddMethod && (
                <AddPaymentMethodModal
                    onClose={() => setShowAddMethod(false)}
                    onSave={handleSaveNewMethod}
                />
            )}

            {confirmDeleteId && (
                <ConfirmTeamModal
                    title="Remove Payout Method"
                    message="Are you sure you want to remove this account? You will need to add it again if you want to use it for future withdrawals."
                    confirmText="Remove Account"
                    onConfirm={handleDeleteMethod}
                    onCancel={() => setConfirmDeleteId(null)}
                />
            )}

            {showWithdrawal && (
                <WithdrawalModal
                    methods={payoutMethods}
                    balance={balance}
                    onConfirm={handleWithdraw}
                    onClose={() => setShowWithdrawal(false)}
                />
            )}
        </ManagerLayout>
    );
}