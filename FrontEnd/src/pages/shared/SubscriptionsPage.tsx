import { useEffect, useState } from 'react';
import { Award, RefreshCw } from 'lucide-react';
import type { AvailablePlan, PlanLevel } from './subscription/SubscriptionTypes';
import { UserButton } from './subscription/UserButton';
import { PlanCardUser } from './subscription/PlanCardUser';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import type { RootState } from '../../app/rootReducer';
import LoadingOverlay from '../../components/shared/LoadingOverlay';
import { PaymentModal } from './subscription/PaymentModal';
import { fetchAvailablePlans } from '../../features/shared/subscription/subscriptionThunks';
import { useSubscribePlan } from '../../hooks/useSubscribePlan';

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

    const handleChoosePlan = (plan: AvailablePlan) => {
        setSelectedPlan(plan);
        setPaymentModalOpen(true);
    };

    const handlePaymentMethod = async (method: "razorpay" | "stripe" | "paypal") => {
        if (!selectedPlan || !userId) return;

        if (method === "razorpay") {
            await handleRazorpaySubscription();
            if (role && userId) {
                dispatch(fetchAvailablePlans({ userId, role }));
            }
        } else {
            if (role && userId) {
                dispatch(fetchAvailablePlans({ userId, role }));
            }
        }
        setPaymentModalOpen(false);
    };

    const handleManageSubscription = () => {
        console.log("Navigate to billing portal…");
    };

    if ((!loading && availablePlans.length === 0) || !userSubscription) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-muted-foreground">
                {/* SVG Illustration - Adapted to use Primary Color */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-40 h-40 mb-6 opacity-80"
                    fill="none"
                    viewBox="0 0 200 200"
                >
                    <circle cx="100" cy="100" r="90" className="stroke-muted-foreground/30" strokeWidth="4" />
                    <path
                        d="M60 120c0-22 18-40 40-40s40 18 40 40"
                        className="stroke-primary"
                        strokeWidth="6"
                        strokeLinecap="round"
                    />
                    <rect
                        x="72"
                        y="125"
                        width="56"
                        height="12"
                        rx="6"
                        className="fill-primary"
                        fillOpacity="0.8"
                    />
                    <circle cx="100" cy="80" r="14" className="stroke-primary" strokeWidth="5" />
                </svg>

                {/* Text */}
                <h2 className="text-2xl font-bold text-foreground mb-2">
                    No Subscription Plans Available
                </h2>

                <p className="text-muted-foreground max-w-md text-center leading-relaxed">
                    Looks like no plans are configured for your role yet.
                    Please check back later or contact the platform admin for more details.
                </p>
            </div>
        );
    }

    return (
        <>
            <LoadingOverlay show={loading || updating} />

            <div className="text-foreground font-sans min-h-screen">
                <div className="pt-10 max-w-7xl mx-auto px-4 sm:px-6">

                    

                    {/* CURRENT SUBSCRIPTION */}
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
                                    <p className="text-lg font-extrabold text-foreground capitalize">{userSubscription.billingCycle}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-muted-foreground">Renewal Date</p>
                                    <p className="text-lg font-extrabold text-foreground">{new Date(userSubscription.expiryDate).toLocaleDateString()}</p>
                                </div>

                                <UserButton
                                    variant="secondary"
                                    icon={<RefreshCw className="w-4 h-4" />}
                                    className="!py-2 !px-4 !shadow-sm hover:shadow-md transition-all !w-auto bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    onClick={handleManageSubscription}
                                >
                                    Manage
                                </UserButton>
                            </div>
                        </div>
                    </div>

                    {/* AVAILABLE PLANS */}
                    <header className="mb-8">
                        <h2 className="text-2xl font-extrabold text-foreground tracking-tight mb-2">
                            Available Plan Tiers
                        </h2>
                        <p className="text-muted-foreground">
                            Upgrade or change your subscription to access new features.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
                        {availablePlans.map(plan => (
                            <PlanCardUser
                                key={plan._id}
                                plan={plan}
                                currentLevel={userSubscription.level as PlanLevel}
                                onChoosePlan={handleChoosePlan}
                            />
                        ))}
                    </div>
                </div>

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