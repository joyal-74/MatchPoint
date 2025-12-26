import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks"; 
import { fetchDashboardStats } from "../../features/admin/dashboard/dashboardSlice"; 
import AdminLayout from "../layout/AdminLayout";
import LoadingOverlay from "../../components/shared/LoadingOverlay"; 
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp, Users, Trophy, Calendar } from "lucide-react";

const COLORS = ["#94a3b8", "#60a5fa", "#4ade80", "#fbbf24"];

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { data, loading } = useAppSelector((state) => state.adminDashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    // Use default empty structures if data is null to prevent crashes
    const stats = data?.counts || { revenue: 0, players: 0, tournaments: 0, teams: 0 };
    const revenueData = data?.revenueData || [];
    const registrationData = data?.registrationData || [];
    const userDistributionData = data?.userDistribution || [];
    const recentTournaments = data?.recentTournaments || [];

    return (
        <AdminLayout>
            <LoadingOverlay show={loading} />
            
            <div className="p-6 space-y-6 min-h-screen text-gray-100">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                        <p className="text-gray-400">Real-time data from your platform.</p>
                    </div>
                </div>

                {/* 1. Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Revenue"
                        value={`₹ ${stats.revenue.toLocaleString()}`}
                        icon={<TrendingUp className="text-green-400" />}
                        trend="Lifetime"
                        trendColor="text-green-400"
                    />
                    <StatCard
                        title="Active Players"
                        value={stats.players.toString()}
                        icon={<Users className="text-blue-400" />}
                        trend="Registered Users"
                        trendColor="text-blue-400"
                    />
                    <StatCard
                        title="Live Tournaments"
                        value={stats.tournaments.toString()}
                        icon={<Trophy className="text-yellow-400" />}
                        trend="Currently Ongoing"
                        trendColor="text-yellow-400"
                    />
                    <StatCard
                        title="Total Teams"
                        value={stats.teams.toString()}
                        icon={<Calendar className="text-purple-400" />}
                        trend="Overall Teams"
                        trendColor="text-purple-400"
                    />
                </div>

                {/* 2. Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue */}
                    <div className="bg-neutral-800 p-6 rounded-xl shadow-lg border border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-gray-200">Revenue Trends</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                    <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#fff" }} />
                                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Registrations */}
                    <div className="bg-neutral-800 p-6 rounded-xl shadow-lg border border-gray-700">
                        <h3 className="text-lg font-semibold mb-4 text-gray-200">New Registrations (Last 7 Days)</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={registrationData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                    <XAxis dataKey="date" tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: '#374151', opacity: 0.4 }} contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#fff" }} />
                                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Pie Chart */}
                    <div className="bg-neutral-800 p-6 rounded-xl shadow-lg border border-gray-700 lg:col-span-1">
                        <h3 className="text-lg font-semibold mb-4 text-gray-200">User Distribution</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={userDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                        {userDistributionData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#fff" }} />
                                    <Legend verticalAlign="bottom" wrapperStyle={{ color: "#9ca3af" }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-neutral-800 p-6 rounded-xl shadow-lg border border-gray-700 lg:col-span-2">
                        <h3 className="text-lg font-semibold mb-4 text-gray-200">Recent Tournaments</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-gray-400 text-sm border-b border-gray-700">
                                        <th className="pb-3 font-medium">Tournament</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Teams</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-300">
                                    {recentTournaments.length > 0 ? recentTournaments.map((t) => (
                                        <tr key={t._id} className="border-b border-gray-700 hover:bg-neutral-700/50">
                                            <td className="py-4 font-medium text-white">{t.title}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded text-xs ${t.status === 'ongoing' ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'}`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-400">{t.currTeams} Teams</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={3} className="py-4 text-center text-gray-500">No recent tournaments</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
};


interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend: string;
    trendColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendColor }) => (
    <div className="bg-neutral-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className="p-2 bg-neutral-700/50 rounded-lg">{icon}</div>
        </div>
        <p className={`text-xs font-medium ${trendColor}`}>{trend}</p>
    </div>
);

export default Dashboard;