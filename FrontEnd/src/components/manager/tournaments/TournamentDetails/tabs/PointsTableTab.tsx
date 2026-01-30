import { useState, useEffect, useCallback } from "react";
import { 
    Activity, Search, GitGraph, 
    Handshake, Users, ArrowRight, History, 
    Trophy, RefreshCcw, AlertCircle
} from "lucide-react";
import EmptyState from "../shared/EmptyState"; 
import type { PointsRow } from "../../../../../features/manager/Tournaments/tournamentTypes";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/hooks";
import { fetchTournamentPointsTable } from "../../../../../features/manager/Tournaments/tournamentThunks"; 
import { clearPointsTableError } from "../../../../../features/manager/Tournaments/tournamentSlice";

// --- SUB-COMPONENT: The Table (Unchanged) ---
const TableView = ({ data }: { data: PointsRow[] }) => {
    if (!data || data.length === 0) return (
        <div className="p-12 text-center border-2 border-dashed border-border rounded-xl bg-muted/20">
            <p className="text-muted-foreground font-medium">No matches played yet.</p>
        </div>
    );

    return (
        <div className="w-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-500">
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/40 border-b border-border text-xs uppercase text-muted-foreground font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 text-center w-16">Pos</th>
                            <th className="px-6 py-4">Team</th>
                            <th className="px-4 py-4 text-center">P</th>
                            <th className="px-4 py-4 text-center text-green-600 dark:text-green-400">W</th>
                            <th className="px-4 py-4 text-center text-red-600 dark:text-red-400">L</th>
                            <th className="px-6 py-4 text-right">NRR</th>
                            <th className="px-6 py-4 text-center">Pts</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {data.map((row) => (
                            <tr key={row._id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 text-center">
                                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                        row.rank <= 2 ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                                    }`}>
                                        {row.rank}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-3">
                                    {row.teamLogo && (
                                        <img src={row.teamLogo} alt={row.team} className="w-6 h-6 rounded-full object-cover bg-muted" />
                                    )}
                                    {row.team}
                                </td>
                                <td className="px-4 py-4 text-center text-muted-foreground">{row.p}</td>
                                <td className="px-4 py-4 text-center font-bold text-green-600 dark:text-green-400 bg-green-500/5">{row.w}</td>
                                <td className="px-4 py-4 text-center font-bold text-red-600 dark:text-red-400 bg-red-500/5">{row.l}</td>
                                <td className="px-6 py-4 text-right font-mono text-xs text-muted-foreground">{row.nrr}</td>
                                <td className="px-6 py-4 text-center font-black text-primary text-base">{row.pts}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---

interface PointsTableTabProps {
    tournamentId: string;
    format: 'league' | 'knockout' | 'groups' | 'friendly'; 
    onNavigate?: (tab: string) => void;
}

export default function PointsTableTab({ tournamentId, format, onNavigate }: PointsTableTabProps) {
    const dispatch = useAppDispatch();
    
    const { 
        data: pointsData, 
        loading, 
        error 
    } = useAppSelector((state) => state.managerTournaments.pointsTable); 

    const [activeGroup, setActiveGroup] = useState<string>("");

    const loadData = useCallback(() => {
        if (format !== 'knockout' && format !== 'friendly') {
            dispatch(fetchTournamentPointsTable(tournamentId));
        }
    }, [dispatch, tournamentId, format]);

    useEffect(() => {
        loadData();
        return () => {
            dispatch(clearPointsTableError());
        };
    }, [loadData, dispatch]);

    useEffect(() => {
        if (format === 'groups' && pointsData?.groups && pointsData.groups.length > 0 && !activeGroup) {
            setActiveGroup(pointsData.groups[0].groupName);
        }
    }, [format, pointsData, activeGroup]);

    // --- LOADING STATE ---
    if (loading) return (
        <div className="h-64 flex flex-col items-center justify-center gap-3 animate-pulse">
            <div className="w-12 h-12 bg-muted rounded-full" />
            <div className="h-4 w-32 bg-muted rounded" />
            <p className="text-xs text-muted-foreground">Calculating standings...</p>
        </div>
    );

    // --- ERROR STATE ---
    if (error) return (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertCircle size={24} />
            </div>
            <div className="space-y-1">
                <p className="font-medium text-foreground">Something went wrong</p>
                <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <button 
                onClick={loadData}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
                <RefreshCcw size={12} /> Try Again
            </button>
        </div>
    );

    // --- CASE 1: KNOCKOUT ---
    if (format === 'knockout') {
        return (
            <div className="py-12 animate-in zoom-in-95 duration-500">
                <EmptyState
                    icon={<GitGraph size={56} className="mx-auto mb-6 text-orange-500 opacity-80" />}
                    title="Knockout Format"
                    message="Points are not tracked in knockout tournaments."
                    subtitle="Check the bracket to see the road to the finals."
                />
                <div className="flex justify-center mt-8">
                    <button 
                        onClick={() => onNavigate?.('matches')}
                        className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-sm shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Trophy size={18} className="fill-white/20" />
                        <span>View Tournament Bracket</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        );
    }

    // --- CASE 2: FRIENDLY ---
    if (format === 'friendly') {
        return (
            <div className="py-12 animate-in zoom-in-95 duration-500">
                <EmptyState
                    icon={<Handshake size={56} className="mx-auto mb-6 text-blue-500 opacity-80" />}
                    title="Exhibition Matches"
                    message="Friendly matches don't have an official points table."
                    subtitle="You can still view the history of all matches played."
                />
                <div className="flex justify-center mt-8">
                    <button 
                        onClick={() => onNavigate?.('results')}
                        className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-card border border-border hover:border-blue-500/50 hover:bg-muted/50 text-foreground font-bold text-sm shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                    >
                        <History size={18} className="text-blue-500" />
                        <span>View Match Results</span>
                        <ArrowRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        );
    }

    // --- CASE 3: GROUPS ---
    if (format === 'groups') {
        // ✅ FIX 3: Check pointsData.groups
        const groups = pointsData?.groups || [];
        const currentRows = groups.find((g: any) => g.groupName === activeGroup)?.rows || [];

        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/20 p-4 rounded-xl border border-border">
                    <div>
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Users className="text-primary" size={20} /> Group Stage
                        </h2>
                    </div>

                    {groups.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {groups.map((group: any) => (
                                <button
                                    key={group.groupName}
                                    onClick={() => setActiveGroup(group.groupName)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                                        activeGroup === group.groupName 
                                        ? "bg-primary text-primary-foreground shadow-md" 
                                        : "bg-background border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                                >
                                    {group.groupName}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <span className="text-xs text-muted-foreground italic">No groups found</span>
                    )}
                </div>

                <TableView data={currentRows} />
            </div>
        );
    }

    // --- CASE 4: LEAGUE ---
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Activity className="text-primary" size={22} /> League Table
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">Top teams qualify for finals</p>
                </div>
                
                <div className="hidden sm:block relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                     <input 
                        type="text" 
                        placeholder="Search team..." 
                        className="h-9 pl-9 pr-4 rounded-full bg-card border border-border text-xs w-48 focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    />
                </div>
            </div>
            
            <TableView data={pointsData?.table || []} />
        </div>
    );
}