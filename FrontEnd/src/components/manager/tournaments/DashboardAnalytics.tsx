import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    Users, Trophy, ArrowUpRight,
    CircleDollarSign
} from 'lucide-react';
import type { Tournament } from '../../../features/manager/managerTypes';

// --- TYPES ---

export interface RevenueChartData {
    name: string;
    income: number;
    expense: number;
    [key: string]: string | number;
}

export interface FormatChartData {
    name: string;
    value: number;
    [key: string]: string | number;
}

export interface TrafficChartData {
    day: string;
    teams: number;
    [key: string]: string | number;
}

interface DashboardAnalyticsProps {
    revenueData: RevenueChartData[];
    formatData: FormatChartData[];
    trafficData: TrafficChartData[];
    topTournaments: Partial<Tournament>[];
}

const CHART_COLORS = ['hsl(var(--primary))', '#3b82f6', '#f59e0b', '#10b981'];



export default function DashboardAnalytics({ revenueData, formatData, trafficData, topTournaments }: DashboardAnalyticsProps) {
    return (
        <div className="flex flex-col gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* === ROW 1 === */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[350px]">

                {/* 1. Revenue (Spans 2 cols) */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <div>
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <CircleDollarSign className="text-primary" size={20} /> Revenue Analytics
                            </h3>
                            <p className="text-xs text-muted-foreground">Income (Commission) vs Expenses</p>
                        </div>
                        {/* Optional: Add a total summary here if available in props */}
                    </div>

                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)', color: 'hsl(var(--popover-foreground))' }} />
                                <Area type="monotone" dataKey="income" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="hsl(var(--destructive))" strokeWidth={2} fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Format Popularity (Spans 1 col) */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col h-full">
                    <div className="mb-2 shrink-0">
                        <h3 className="text-lg font-bold text-foreground">Formats</h3>
                        <p className="text-xs text-muted-foreground">Popularity by type</p>
                    </div>

                    <div className="flex-1 relative min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={formatData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {formatData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--popover))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: 'var(--radius)',
                                        color: 'hsl(var(--popover-foreground))'
                                    }}
                                    itemStyle={{
                                        color: 'hsl(var(--popover-foreground))'
                                    }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Label (Optional - shows top format percentage) */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                            <span className="text-2xl font-black text-foreground">
                                {formatData.length > 0 ? formatData[0].value : 0}%
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                {formatData.length > 0 ? formatData[0].name : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* === ROW 2 === */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[350px]">

                {/* 3. Traffic (Spans 1 col) */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <div>
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Users size={18} className="text-primary" /> Traffic
                            </h3>
                            <p className="text-xs text-muted-foreground">New teams / day</p>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trafficData}>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} dy={10} />
                                <Tooltip
                                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--popover))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: 'var(--radius)',
                                        color: 'hsl(var(--popover-foreground))'
                                    }}
                                    itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                                />
                                <Bar dataKey="teams" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Top Tournaments (Spans 2 cols) */}
                <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <div>
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Trophy size={18} className="text-yellow-500" /> Top Events
                            </h3>
                            <p className="text-xs text-muted-foreground">By total volume & engagement</p>
                        </div>
                        <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                            View All <ArrowUpRight size={14} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto pr-1">
                        {/* Header */}
                        <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                            <div className="col-span-5">Name</div>
                            <div className="col-span-3 text-center">Volume</div>
                            <div className="col-span-4">Teams</div>
                        </div>

                        {/* List */}
                        <div className="space-y-2">
                            {topTournaments.map((tour) => {
                                // 1. Create safe local variables with defaults
                                const currentTeams = tour.currTeams || 0;
                                const maximumTeams = tour.maxTeams || 1;
                                const entryFee = tour.entryFee || 0;

                                // 2. Safe calculation
                                const volume = Number(entryFee) * currentTeams;
                                const percentage = Math.round((currentTeams / maximumTeams) * 100);

                                return (
                                    <div key={tour._id} className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                                        <div className="col-span-5">
                                            <p className="text-xs font-bold text-foreground truncate" title={tour.title}>
                                                {tour.title || "Untitled Tournament"}
                                            </p>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${tour.status === 'ongoing' ? 'text-green-600 bg-green-500/10' :
                                                tour.status === 'upcoming' ? 'text-blue-600 bg-blue-500/10' :
                                                    'text-muted-foreground bg-muted'
                                                }`}>
                                                {tour.status || "Unknown"}
                                            </span>
                                        </div>
                                        <div className="col-span-3 text-center">
                                            <span className="text-xs font-bold text-foreground">
                                                ₹{volume.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="col-span-4">
                                            <div className="flex justify-between text-[9px] font-medium text-muted-foreground mb-1">
                                                <span>{currentTeams}/{maximumTeams}</span>
                                                <span>{percentage}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}