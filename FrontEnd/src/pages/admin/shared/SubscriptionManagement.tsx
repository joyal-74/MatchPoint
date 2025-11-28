import { useState, useMemo, useCallback } from 'react';
import { Plus, } from 'lucide-react';
import AdminLayout from '../../layout/AdminLayout';
import { AdminButton } from './subscription/AdminButton';
import type { Plan, UserRole } from './subscription/SubscriptionTypes';
import { PlanCard } from './subscription/PlanCard';
import { AddPlanModal } from './subscription/AddPlanModal';


const initialPlans: Plan[] = [
    {
        id: 'p1',
        userType: 'Player',
        level: 'Free',
        title: 'Rookie Access',
        price: 0,
        features: ['Basic profile', 'View leaderboards', 'Limited match history'],
    },
    {
        id: 'p2',
        userType: 'Player',
        level: 'Premium',
        title: 'Pro Player Elite',
        price: 9.99,
        features: ['All Rookie features', 'Unlimited match history', 'Advanced stats analysis', 'Priority support'],
    },
    {
        id: 'm1',
        userType: 'Manager',
        level: 'Super',
        title: 'Club Administrator',
        price: 49.99,
        features: ['Unlimited team management', 'Recruitment tools', 'Financial dashboards', 'API access'],
    },
    {
        id: 'v1',
        userType: 'Viewer',
        level: 'Free',
        title: 'Fan Basic',
        price: 0,
        features: ['Watch live streams (ad-supported)', 'Basic news feed'],
    },
];


export default function SubscriptionManagement() {
    const [plans, setPlans] = useState<Plan[]>(initialPlans);
    const [activeTab, setActiveTab] = useState<UserRole>('Player');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const tabs: UserRole[] = ['Player', 'Manager', 'Viewer'];

    // Filter plans based on the active tab
    const filteredPlans = useMemo(() => {
        return plans.filter(plan => plan.userType === activeTab);
    }, [plans, activeTab]);

    const handleAddNewPlan = useCallback((newPlan: Omit<Plan, 'id'>) => {
        const planWithId: Plan = {
            ...newPlan,
            id: crypto.randomUUID(), // Generate a unique ID
            userType: activeTab, // Ensure the plan is associated with the current tab
        };
        setPlans(prevPlans => [...prevPlans, planWithId]);
        console.log('New Plan Added:', planWithId);
    }, [activeTab]);

    const handleDeletePlan = useCallback((id: string) => {
        setPlans(prevPlans => prevPlans.filter(plan => plan.id !== id));
        console.log(`Plan ${id} deleted.`);
    }, []);

    // Mock handlers for View and Edit
    const handleViewPlan = useCallback((plan: Plan) => {
        // In a real application, this would open a detailed view modal
        console.log('Viewing Plan Details:', plan);
    }, []);

    const handleEditPlan = useCallback((plan: Plan) => {
        // In a real application, this would open the AddPlanModal pre-filled for editing
        console.log('Editing Plan:', plan);
    }, []);


    return (
        <AdminLayout>
            <div className="text-neutral-100 pt-8 max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                        Subscription Management
                    </h1>
                    <p className="text-neutral-400">
                        Define and manage subscription tiers for all user roles.
                    </p>
                </header>

                {/* Tabs for User Roles */}
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

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPlans.length > 0 ? (
                        filteredPlans.map(plan => (
                            <PlanCard 
                                key={plan.id} 
                                plan={plan} 
                                onDelete={handleDeletePlan} 
                                onEdit={handleEditPlan}
                                onView={handleViewPlan}
                            />
                        ))
                    ) : (
                        <div className="lg:col-span-4 text-center p-12 bg-neutral-800 rounded-xl border border-neutral-700">
                            <p className="text-neutral-400 text-lg">No plans defined for the {activeTab} role yet.</p>
                        </div>
                    )}
                </div>

                <AddPlanModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddNewPlan}
                    selectedUserType={activeTab}
                />
            </div>
        </AdminLayout>
    );
}