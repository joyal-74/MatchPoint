import { useEffect, useState } from 'react';
import { AlertCircle, Award,  } from 'lucide-react';
// import { CalendarClock, RefreshCw  } from 'lucide-react';
// import { UserButton } from './subscription/UserButton';
import type { AvailablePlan, PlanLevel } from './subscription/SubscriptionTypes';
import { PlanCardUser } from './subscription/PlanCardUser';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import type { RootState } from '../../app/rootReducer';
import LoadingOverlay from '../../components/shared/LoadingOverlay';
import { PaymentModal } from './subscription/PaymentModal';
import { fetchAvailablePlans, updatePlanDirectly } from '../../features/shared/subscription/subscriptionThunks';
import { useSubscribePlan } from '../../hooks/useSubscribePlan';

// --- HELPER: Define Plan Hierarchy ---
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

    // Hook for handling Razorpay/Stripe (only used for Upgrades)
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

    // --- LOGIC: Handle Plan Selection ---
    const handleChoosePlan = async (plan: AvailablePlan) => {
        if (!userSubscription || !userId) return;

        const currentRank = getPlanRank(userSubscription.level);
        const targetRank = getPlanRank(plan.level);

        // CASE 1: Downgrade (No Payment Required)
        if (targetRank < currentRank) {
            const confirmed = window.confirm(
                `Are you sure you want to downgrade to ${plan.title}? \n\nThis change will take effect automatically on ${new Date(userSubscription.expiryDate).toLocaleDateString()} after your current plan expires.`
            );

            if (confirmed) {
                // Dispatch the direct update thunk (Ensure this exists in your subscriptionThunks.ts)
                await dispatch(updatePlanDirectly({ 
                    userId, 
                    planLevel: plan.level, 
                    billingCycle: plan.billingCycle 
                }));
                
                // Refresh data to show the "Scheduled" alert
                dispatch(fetchAvailablePlans({ userId, role: role! }));
            }
            return; 
        }

        // CASE 2: Upgrade (Payment Required)
        // Opens the modal for Razorpay/Stripe
        setSelectedPlan(plan);
        setPaymentModalOpen(true);
    };

    const handlePaymentMethod = async (method: "razorpay" | "stripe" | "paypal") => {
        if (!selectedPlan || !userId) return;

        if (method === "razorpay") {
            await handleRazorpaySubscription();
            // Refresh logic is usually handled inside the hook, but good to ensure:
            if (role) dispatch(fetchAvailablePlans({ userId, role }));
        } else {
            // Placeholder for Stripe/Paypal
            if (role) dispatch(fetchAvailablePlans({ userId, role }));
        }
        setPaymentModalOpen(false);
    };

    // const handleManageSubscription = () => {
    //     // Logic for Customer Portal (if using Stripe Billing Portal)
    //     console.log("Navigate to billing portal...");
    // };

    // --- RENDER: Empty State ---
    if ((!loading && availablePlans.length === 0) || !userSubscription) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-muted-foreground">
                <h2 className="text-2xl font-bold text-foreground mb-2">No Plans Available</h2>
                <p>Please check back later.</p>
            </div>
        );
    }

    return (
        <>
            <LoadingOverlay show={loading || updating} />

            <div className="text-foreground font-sans min-h-screen">
                <div className="pt-10 max-w-7xl mx-auto px-4 sm:px-6">

                    {/* --- ALERT 2: Reserved Balance (From previous upgrade) --- */}
                    {userSubscription?.reservedPlan && userSubscription.reservedPlan.daysRemaining > 0 && (
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-4 rounded-xl mb-6 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-500 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-blue-800 dark:text-blue-400">Reserved Plan Balance</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-500/80 mt-1">
                                    You have <strong>{userSubscription.reservedPlan.daysRemaining} days</strong> of the 
                                    <strong> {userSubscription.reservedPlan.level}</strong> plan remaining. 
                                    These will be credited back to you if your current Premium plan expires.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* --- SECTION: Current Subscription --- */}
                    <div className="bg-card p-4 sm:p-8 rounded-2xl shadow-xl border border-border mb-10 transition-colors duration-300">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">

                            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                                <Award className="w-10 h-10 text-primary" />
                                <div>
                                    <h1 className="text-2xl font-extrabold text-foreground">Your Subscription Status</h1>
                                    <p className="text-muted-foreground mt-1">Manage your plan details and billing cycle.</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6 text-sm">
                                <div>
                                    <p className="font-bold text-muted-foreground">Current Plan</p>
                                    <p className="text-lg font-extrabold text-primary capitalize">{userSubscription.level}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-muted-foreground">Billing Cycle</p>
                                    <p className="text-lg font-extrabold text-foreground capitalize">{userSubscription.billingCycle || "Monthly"}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-muted-foreground">Renewal Date</p>
                                    <p className="text-lg font-extrabold text-foreground">
                                        {userSubscription.expiryDate 
                                            ? new Date(userSubscription.expiryDate).toLocaleDateString() 
                                            : "N/A"}
                                    </p>
                                </div>

                                {/* <UserButton
                                    variant="secondary"
                                    icon={<RefreshCw className="w-4 h-4" />}
                                    className="!py-2 !px-4 !shadow-sm hover:shadow-md transition-all !w-auto bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    onClick={handleManageSubscription}
                                >
                                    Manage
                                </UserButton> */}
                            </div>
                        </div>
                    </div>

                    {/* --- SECTION: Available Plans --- */}
                    <header className="mb-8">
                        <h2 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
                            Available Plan Tiers
                        </h2>
                        <p className="text-muted-foreground">
                            Upgrade immediately or schedule a plan change.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
                        {availablePlans.map(plan => (
                            <PlanCardUser
                                key={plan._id}
                                plan={plan}
                                currentLevel={userSubscription.level as PlanLevel}
                                onChoosePlan={handleChoosePlan}
                                // Pass the scheduled downgrade level (if any) to the card
                                pendingDowngrade={userSubscription.scheduledChange?.level as PlanLevel} 
                            />
                        ))}
                    </div>
                </div>

                {/* --- MODAL: Payments (Only used for Upgrades) --- */}
                <PaymentModal
                    open={paymentModalOpen}
                    planTitle={selectedPlan?.title || ""}
                    amount={selectedPlan?.price || 0}
                    onClose={() => setPaymentModalOpen(false)}
                    onSelect={handlePaymentMethod}
                />
            </div>
        </>
    );
}