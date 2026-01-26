import { useEffect, useState } from 'react';
import { 
    AlertTriangle, 
    CheckCircle2, 
    Calendar, 
    CreditCard, 
    Layers
} from 'lucide-react';
import type { AvailablePlan, PlanLevel } from './subscription/SubscriptionTypes';
import { PlanCardUser } from './subscription/PlanCardUser';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import type { RootState } from '../../app/rootReducer';
import LoadingOverlay from '../../components/shared/LoadingOverlay';
import { PaymentModal } from './subscription/PaymentModal';
import { fetchAvailablePlans, updatePlanDirectly } from '../../features/shared/subscription/subscriptionThunks';
import { useSubscribePlan } from '../../hooks/useSubscribePlan';

// Helper for ranks
const getPlanRank = (level: PlanLevel | string): number => {
    const ranks: Record<string, number> = { "Free": 0, "Basic": 1, "Super": 2, "Premium": 3 };
    return ranks[level] || 0;
};

export default function UserSubscriptionPage() {
    const user = useAppSelector((state) => state.auth.user);
    const role = useAppSelector((state) => state.auth.user?.role);
    const userId = useAppSelector((state) => state.auth.user?._id);
    const dispatch = useAppDispatch();
    
    const [selectedPlan, setSelectedPlan] = useState<AvailablePlan | null>(null);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);

    const { availablePlans, userSubscription, loading, updating } = useAppSelector(
        (state: RootState) => state.userSubscription
    );

    const { handleRazorpaySubscription } = useSubscribePlan({
        plan: selectedPlan,
        userId: user?._id,
        userName: `${user?.firstName} ${user?.lastName}`,
        userEmail: user?.email,
        onModalClose: () => setPaymentModalOpen(false)
    });
    
    useEffect(() => {
        if (role && userId) {
            dispatch(fetchAvailablePlans({ userId, role }));
        }
    }, [role, userId, dispatch]);

    const handleChoosePlan = async (plan: AvailablePlan) => {
        if (!userSubscription || !userId) return;

        const currentRank = getPlanRank(userSubscription.level);
        const targetRank = getPlanRank(plan.level);

        if (targetRank < currentRank) {
            const confirmed = window.confirm(
                `Downgrade to ${plan.title}? This will apply on ${new Date(userSubscription.expiryDate).toLocaleDateString()}.`
            );

            if (confirmed) {
                await dispatch(updatePlanDirectly({ 
                    userId, 
                    planLevel: plan.level, 
                    billingCycle: plan.billingCycle 
                }));
                dispatch(fetchAvailablePlans({ userId, role: role! }));
            }
            return; 
        }

        setSelectedPlan(plan);
        setPaymentModalOpen(true);
    };

    const handlePaymentMethod = async (method: "razorpay" | "stripe" | "paypal") => {
        if (!selectedPlan || !userId) return;
        if (method === "razorpay") {
            await handleRazorpaySubscription();
            if (role) dispatch(fetchAvailablePlans({ userId, role }));
        }
        setPaymentModalOpen(false);
    };

    // --- RENDER: Empty State ---
    if ((!loading && availablePlans.length === 0) || !userSubscription) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p className="text-sm font-medium">No subscription plans available.</p>
            </div>
        );
    }

    const isFree = userSubscription.level === 'Free';
    const hasReserved = userSubscription?.reservedPlan && userSubscription.reservedPlan.daysRemaining > 0;

    return (
        <>
            <LoadingOverlay show={loading || updating} />

            <div className="text-foreground max-w-7xl mx-auto px-4 sm:px-6 py-6">
                
                {/* --- COMPACT CURRENT SUBSCRIPTION SECTION --- */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold mb-3 tracking-tight">Subscription Status</h2>
                    
                    <div className="bg-card border border-border rounded-lg shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center divide-y md:divide-y-0 md:divide-x divide-border">
                            
                            {/* 1. Plan Identity (Small & Direct) */}
                            <div className="p-4 flex items-center gap-3 min-w-[240px]">
                                <div className={`p-2 rounded-md ${isFree ? 'bg-muted' : 'bg-primary/10 text-primary'}`}>
                                    <Layers size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold">Current Plan</p>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg leading-none">{userSubscription.level}</span>
                                        {userSubscription.status === 'active' && (
                                            <span className="text-green-600 dark:text-green-400">
                                                <CheckCircle2 size={14} fill="currentColor" className="opacity-20" />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Key Details (Cycle & Expiry) */}
                            <div className="p-4 flex-grow grid grid-cols-2 sm:flex sm:items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                                        <CreditCard size={12} /> Billing
                                    </span>
                                    <span className="text-sm font-medium capitalize text-foreground">
                                        {userSubscription.billingCycle || "N/A"}
                                    </span>
                                </div>
                                
                                <div className="flex flex-col">
                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                                        <Calendar size={12} /> {isFree ? "Valid Until" : "Renews On"}
                                    </span>
                                    <span className="text-sm font-medium text-foreground">
                                        {userSubscription.expiryDate 
                                            ? new Date(userSubscription.expiryDate).toLocaleDateString()
                                            : "Forever"}
                                    </span>
                                </div>
                            </div>

                            {/* 3. Reserved Balance (Merged into the row if it exists, to save space) */}
                            {hasReserved && (
                                <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 md:max-w-xs flex items-start gap-3">
                                    <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                                    <div className="text-xs text-blue-700 dark:text-blue-400">
                                        <span className="font-semibold block mb-0.5">Pending Credit</span>
                                        {userSubscription.reservedPlan?.daysRemaining} days of {userSubscription.reservedPlan?.level} remaining.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- AVAILABLE PLANS --- */}
                <div>
                    <h3 className="text-lg font-bold mb-3 tracking-tight">Change Plan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {availablePlans.map(plan => (
                            <PlanCardUser
                                key={plan._id}
                                plan={plan}
                                currentLevel={userSubscription.level as PlanLevel}
                                onChoosePlan={handleChoosePlan}
                                pendingDowngrade={userSubscription.scheduledChange?.level as PlanLevel} 
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MODAL --- */}
            <PaymentModal
                open={paymentModalOpen}
                planTitle={selectedPlan?.title || ""}
                amount={selectedPlan?.price || 0}
                onClose={() => setPaymentModalOpen(false)}
                onSelect={handlePaymentMethod}
            />
        </>
    );
}