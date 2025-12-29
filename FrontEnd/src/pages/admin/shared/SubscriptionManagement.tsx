import { useEffect, useMemo, useCallback, useState } from 'react';
import { Plus } from 'lucide-react';
import AdminLayout from '../../layout/AdminLayout';

// Components
import { PlanCard } from './subscription/PlanCard';
import { AddPlanModal } from './subscription/AddPlanModal';
import { EditPlanModal } from './subscription/EditPlanModal';
import { PlanDetailModal } from './subscription/PlanDetailModal';
import LoadingOverlay from '../../../components/shared/LoadingOverlay';

// Redux / Types
import type { Plan, UserRole } from './subscription/SubscriptionTypes';
import { fetchPlans, addPlan, deletePlan, updatePlan } from "../../../features/admin/subscription/subscriptionThunks";
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '../../../utils/apiError';

export default function SubscriptionManagement() {
    const dispatch = useAppDispatch();
    const { plans, loading } = useAppSelector(state => state.subscription);

    // --- State ---
    const [activeTab, setActiveTab] = useState<UserRole>('player');

    // Modals State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPlanForView, setSelectedPlanForView] = useState<Plan | null>(null);
    const [planToEdit, setPlanToEdit] = useState<Plan | null>(null);

    const tabs: { id: UserRole; label: string }[] = [
        { id: 'player', label: 'Player Plans' },
        { id: 'manager', label: 'Manager Plans' },
        { id: 'viewer', label: 'Viewer Plans' }
    ];

    useEffect(() => {
        dispatch(fetchPlans({}));
    }, [dispatch]);

    const filteredPlans = useMemo(() => {
        return plans.filter(plan => plan.userType === activeTab);
    }, [plans, activeTab]);

    // --- Handlers ---

    const handleAddNewPlan = useCallback(async (newPlanData: Omit<Plan, '_id'>) => {
        try {
            await dispatch(addPlan(newPlanData)).unwrap();

            toast.success("Plan created successfully!");
            setIsAddModalOpen(false);
        } catch (error: unknown) {
            console.error("Failed to create plan:", error);
            toast.error(getApiErrorMessage(error));
        }
    }, [dispatch]);

    const handleDeletePlanById = useCallback(async (id: string) => {
        await dispatch(deletePlan(id));
        if (selectedPlanForView && selectedPlanForView._id === id) {
            setSelectedPlanForView(null);
        }
    }, [dispatch, selectedPlanForView]);

    const handleEditClick = useCallback((plan: Plan) => {
        setPlanToEdit(plan);
        setIsEditModalOpen(true);
        setSelectedPlanForView(null);
    }, []);

    const handleSaveEditedPlan = useCallback(async (id: string, updatedPlan: Omit<Plan, "_id">) => {
        try {
            await dispatch(updatePlan({ id, newData: updatedPlan })).unwrap();

            toast.success("Plan updated successfully!");
            setIsEditModalOpen(false);
            setPlanToEdit(null);
        } catch (error: unknown) {
            console.error("Failed to update plan:", error);
            toast.error(getApiErrorMessage(error));
        }
    }, [dispatch]);

    return (
        <AdminLayout>
            <LoadingOverlay show={loading} />

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-[85vh]">

                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                        Subscription Management
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Define and manage subscription tiers for all user roles.
                    </p>
                </header>

                {/* Tabs */}
                <div className="mb-8 border-b border-border">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-all duration-200
                                ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Action Bar */}
                <section className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-semibold text-foreground capitalize">
                        {activeTab} Subscription Tiers
                    </h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm font-medium text-sm"
                    >
                        <Plus size={18} />
                        Add New Plan
                    </button>
                </section>

                {/* Content Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredPlans.length > 0 ? (
                            filteredPlans.map(plan => (
                                <PlanCard
                                    key={plan._id}
                                    plan={plan}
                                    onDelete={() => handleDeletePlanById(plan._id)}
                                    onEdit={() => handleEditClick(plan)}
                                    onView={(p) => setSelectedPlanForView(p)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-xl bg-card/50">
                                <div className="p-3 rounded-full bg-muted/50 mb-3">
                                    <Plus className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-medium text-foreground">No Plans Found</h3>
                                <p className="text-muted-foreground max-w-sm mt-1 mb-4">
                                    There are currently no active subscription plans for {activeTab}s.
                                </p>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="text-primary hover:underline text-sm font-medium"
                                >
                                    Create one now
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Modals */}
                <AddPlanModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSave={handleAddNewPlan}
                    selectedUserType={activeTab}
                />

                <EditPlanModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveEditedPlan}
                    planToEdit={planToEdit}
                />

                <PlanDetailModal
                    selectedPlan={selectedPlanForView}
                    onClose={() => setSelectedPlanForView(null)}
                    onEdit={handleEditClick}
                    onDelete={handleDeletePlanById}
                />
            </div>
        </AdminLayout>
    );
}