import { useEffect, useMemo, useCallback, useState } from 'react';
import { Plus } from 'lucide-react';
import AdminLayout from '../../layout/AdminLayout';
import { AdminButton } from './subscription/AdminButton';

import { PlanCard } from './subscription/PlanCard';
import { AddPlanModal } from './subscription/AddPlanModal';
import { PlanDetailModal } from './subscription/PlanDetailModal';

import type { Plan, UserRole } from './subscription/SubscriptionTypes';


import { fetchPlans, addPlan, deletePlan } from "../../../features/admin/subscription/subscriptionThunks";
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import LoadingOverlay from '../../../components/shared/LoadingOverlay';

export default function SubscriptionManagement() {
    const dispatch = useAppDispatch();

    // Redux state
    const { plans, loading } = useAppSelector(state => state.subscription);

    // Local UI state
    const [activeTab, setActiveTab] = useState<UserRole>('player');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlanForView, setSelectedPlanForView] = useState<Plan | null>(null);

    const tabs: UserRole[] = ['player', 'manager', 'viewer'];

    useEffect(() => {
        dispatch(fetchPlans({}));
    }, [dispatch]);

    const filteredPlans = useMemo(() => {
        return plans.filter(plan => plan.userType === activeTab);
    }, [plans, activeTab]);

    const handleAddNewPlan = useCallback(
        async (newPlanData: Omit<Plan, '_id'>) => {
            await dispatch(addPlan(newPlanData));
            setIsModalOpen(false);
        },
        [dispatch]
    );

    const handleDeletePlanById = useCallback(
        async (id: string) => {
            await dispatch(deletePlan(id));
        },
        [dispatch]
    );

    const handleViewPlan = useCallback((plan: Plan) => {
        setSelectedPlanForView(plan);
    }, []);

    const handleDeleteAndCloseModal = useCallback(
        async (id: string) => {
            await handleDeletePlanById(id);
            setSelectedPlanForView(null);
        },
        [handleDeletePlanById]
    );

    const handleEditAndCloseModal = useCallback(
        (plan: Plan) => {
            console.log("Edit functionality coming soon", plan);
            setSelectedPlanForView(null);
        },
        []
    );

    return (
        <AdminLayout>
            <LoadingOverlay show={loading} />
            <div className="text-neutral-100 pt-8 max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                        Subscription Management
                    </h1>
                    <p className="text-neutral-400">
                        Define and manage subscription tiers for all user roles.
                    </p>
                </header>

                {/* Tabs */}
                <div className="mb-6 border-b border-neutral-700">
                    <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    whitespace-nowrap py-3 px-1 sm:px-4 border-b-2 font-medium text-md transition-colors duration-200
                                    ${activeTab === tab
                                        ? 'border-emerald-500 text-emerald-400'
                                        : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:border-neutral-600'
                                    }
                                `}
                            >
                                {tab} Plans
                            </button>
                        ))}
                    </nav>
                </div>

                <section className="mb-8 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-neutral-200">
                        {activeTab} Subscription Tiers
                    </h2>
                    <AdminButton icon={<Plus className="w-5 h-5" />} onClick={() => setIsModalOpen(true)}>
                        Add New Plan
                    </AdminButton>
                </section>

                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPlans.length > 0 ? (
                            filteredPlans.map(plan => (
                                <PlanCard
                                    key={plan._id}
                                    plan={plan}
                                    onDelete={() => handleDeletePlanById(plan._id)}
                                    onEdit={() => console.log("edit")}
                                    onView={handleViewPlan}
                                />
                            ))
                        ) : (
                            <div className="lg:col-span-4 text-center p-12 bg-neutral-800 rounded-xl border border-neutral-700">
                                <p className="text-neutral-400 text-lg">
                                    No plans defined for the {activeTab} role yet.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <AddPlanModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddNewPlan}
                    selectedUserType={activeTab}
                />

                {/* Plan Details Modal */}
                <PlanDetailModal
                    selectedPlan={selectedPlanForView}
                    onClose={() => setSelectedPlanForView(null)}
                    onEdit={handleEditAndCloseModal}
                    onDelete={handleDeleteAndCloseModal}
                />
            </div>
        </AdminLayout>
    );
}
