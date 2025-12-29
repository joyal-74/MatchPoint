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

// Using CSS variables for Pie Chart so it adapts to the theme
const PIE_COLORS = [
    "hsl(var(--primary))",           // Main Theme Color
    "hsl(var(--secondary))",         // Secondary Theme Color
    "hsl(var(--muted-foreground))",  // Grey
    "hsl(var(--border))"             // Light Grey
];

const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    const { data, loading } = useAppSelector((state) => state.adminDashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    const stats = data?.counts || { revenue: 0, players: 0, tournaments: 0, teams: 0 };
    const revenueData = data?.revenueData || [];
    const registrationData = data?.registrationData || [];
    const userDistributionData = data?.userDistribution || [];
    const recentTournaments = data?.recentTournaments || [];

    return (
        <AdminLayout>
            <LoadingOverlay show={loading} />

            <div className="p-4 sm:p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
                    <p className="text-muted-foreground">Real-time data from your platform.</p>
                </div>

                {/* 1. Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <StatCard
                        title="Total Revenue"
                        value={`₹ ${stats.revenue.toLocaleString()}`}
                        icon={<TrendingUp className="text-primary" />}
                        trend="Lifetime"
                        // Using explicit colors for positive/negative trends is usually better than theme colors
                        trendColor="text-green-500" 
                    />
                    <StatCard
                        title="Active Players"
                        value={stats.players.toString()}
                        icon={<Users className="text-blue-500" />}
                        trend="Registered Users"
                        trendColor="text-blue-500"
                    />
                    <StatCard
                        title="Live Tournaments"
                        value={stats.tournaments.toString()}
                        icon={<Trophy className="text-yellow-500" />}
                        trend="Currently Ongoing"
                        trendColor="text-yellow-500"
                    />
                    <StatCard
                        title="Total Teams"
                        value={stats.teams.toString()}
                        icon={<Calendar className="text-purple-500" />}
                        trend="Overall Teams"
                        trendColor="text-purple-500"
                    />
                </div>

                {/* 2. Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                        <h3 className="text-lg font-semibold mb-4 text-foreground">Revenue Trends</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis 
                                        dataKey="name" 
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                                        axisLine={false} 
                                        tickLine={false} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                                        axisLine={false} 
                                        tickLine={false} 
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: "hsl(var(--card))", 
                                            borderColor: "hsl(var(--border))", 
                                            color: "hsl(var(--foreground))",
                                            borderRadius: "8px"
                                        }}
                                        cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    {/* The Line stroke now uses the Dynamic Primary Variable */}
                                    <Line 
                                        type="monotone" 
                                        dataKey="revenue" 
                                        stroke="hsl(var(--primary))" 
                                        strokeWidth={3} 
                                        dot={{ r: 4, fill: "hsl(var(--primary))" }} 
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Registrations Chart */}
                    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                        <h3 className="text-lg font-semibold mb-4 text-foreground">New Registrations <span className="text-xs font-normal text-muted-foreground ml-2">(Last 7 Days)</span></h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={registrationData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                                        axisLine={false} 
                                        tickLine={false}
                                        dy={10}
                                    />
                                    <YAxis 
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                                        axisLine={false} 
                                        tickLine={false} 
                                    />
                                    <Tooltip 
                                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} 
                                        contentStyle={{ 
                                            backgroundColor: "hsl(var(--card))", 
                                            borderColor: "hsl(var(--border))", 
                                            color: "hsl(var(--foreground))",
                                            borderRadius: "8px"
                                        }} 
                                    />
                                    {/* The Bar fill uses Secondary or Primary color */}
                                    <Bar 
                                        dataKey="count" 
                                        fill="hsl(var(--primary))" 
                                        radius={[4, 4, 0, 0]} 
                                        barSize={40} 
                                        fillOpacity={0.8}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Pie Chart */}
                    <div className="bg-card p-6 rounded-xl shadow-sm border border-border lg:col-span-1">
                        <h3 className="text-lg font-semibold mb-4 text-foreground">User Distribution</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={userDistributionData} 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={60} 
                                        outerRadius={80} 
                                        paddingAngle={5} 
                                        dataKey="value" 
                                        stroke="none"
                                    >
                                        {userDistributionData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: "hsl(var(--card))", 
                                            borderColor: "hsl(var(--border))", 
                                            color: "hsl(var(--foreground))",
                                            borderRadius: "8px"
                                        }} 
                                    />
                                    <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: "20px" }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-card p-0 sm:p-6 rounded-xl shadow-sm border border-border lg:col-span-2 overflow-hidden">
                        <div className="p-4 sm:p-0 border-b sm:border-none border-border">
                            <h3 className="text-lg font-semibold text-foreground">Recent Tournaments</h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 border-b border-border">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold text-muted-foreground">Tournament</th>
                                        <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 font-semibold text-muted-foreground">Teams</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {recentTournaments.length > 0 ? recentTournaments.map((t) => (
                                        <tr key={t._id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-foreground">{t.title}</td>
                                            <td className="px-4 py-3">
                                                <span 
                                                    className={`
                                                        px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                        ${t.status === 'ongoing' 
                                                            ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400' 
                                                            : 'bg-muted text-muted-foreground border-border'
                                                        }
                                                    `}
                                                >
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{t.currTeams} Teams</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={3} className="py-8 text-center text-muted-foreground">No recent tournaments</td></tr>
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
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                <h3 className="text-2xl font-bold text-foreground mt-1 tracking-tight">{value}</h3>
            </div>
            <div className="p-2.5 bg-muted rounded-lg border border-border">{icon}</div>
        </div>
        <p className={`text-xs font-medium ${trendColor}`}>{trend}</p>
    </div>
);

export default Dashboard;