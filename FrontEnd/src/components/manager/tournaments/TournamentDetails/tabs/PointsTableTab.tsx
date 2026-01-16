import { useState, useEffect } from "react";
import { 
    Activity, Search, GitGraph, 
    Handshake, Users, ArrowRight, History, 
    Trophy
} from "lucide-react";
import EmptyState from "../shared/EmptyState"; 

// --- TYPES ---
interface PointsRow {
    _id: string;
    rank: number;
    team: string;
    p: number;
    w: number;
    l: number;
    t: number;
    nrr: string;
    pts: number;
    form: string[];
}

interface GroupData {
    groupName: string;
    rows: PointsRow[];
}

// --- SUB-COMPONENT: The Table ---
const TableView = ({ data }: { data: PointsRow[] }) => {
    if (!data || data.length === 0) return (
        <div className="p-12 text-center border-2 border-dashed border-border rounded-xl bg-muted/20">
            <p className="text-muted-foreground font-medium">No matches played in this group yet.</p>
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
                                <td className="px-6 py-4 font-semibold text-foreground">{row.team}</td>
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
    format: 'league' | 'knockout' | 'groups' | 'friendly'; 
    onNavigate?: (tab: string) => void;
}

export default function PointsTableTab({ format, onNavigate }: PointsTableTabProps) {
    const [loading, setLoading] = useState(true);
    const [activeGroup, setActiveGroup] = useState<string>("Group A");
    const [groupData, setGroupData] = useState<GroupData[]>([]);
    const [leagueData, setLeagueData] = useState<PointsRow[]>([]);


    useEffect(() => {
        // SIMULATE API FETCH
        setTimeout(() => {
            if (format === 'league') {
                setLeagueData([
                    { _id: '1', rank: 1, team: 'Royal Strikers', p: 5, w: 4, l: 1, t: 0, nrr: '+1.204', pts: 8, form: [] },
                    { _id: '2', rank: 2, team: 'Galaxy Warriors', p: 5, w: 3, l: 2, t: 0, nrr: '+0.850', pts: 6, form: [] },
                ]);
            } else if (format === 'groups') {
                setGroupData([
                    {
                        groupName: "Group A",
                        rows: [
                            { _id: '1', rank: 1, team: 'Team Alpha', p: 3, w: 3, l: 0, t: 0, nrr: '+2.100', pts: 6, form: [] },
                            { _id: '2', rank: 2, team: 'Team Beta', p: 3, w: 1, l: 2, t: 0, nrr: '-0.500', pts: 2, form: [] },
                        ]
                    },
                    {
                        groupName: "Group B",
                        rows: [] // Empty group test
                    }
                ]);
            }
            setLoading(false);
        }, 600);
    }, [format]);

    if (loading) return (
        <div className="h-64 flex flex-col items-center justify-center gap-3 animate-pulse">
            <div className="w-12 h-12 bg-muted rounded-full" />
            <div className="h-4 w-32 bg-muted rounded" />
        </div>
    );

    // --- CASE 1: KNOCKOUT (Better Action Button) ---
    if (format === 'knockout') {
        return (
            <div className="py-12 animate-in zoom-in-95 duration-500">
                <EmptyState
                    icon={<GitGraph size={56} className="mx-auto mb-6 text-orange-500 opacity-80" />}
                    title="Knockout Format"
                    message="Points are not tracked in knockout tournaments. Teams advance by winning elimination matches."
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

    // --- CASE 2: FRIENDLY (Better Action Button) ---
    if (format === 'friendly') {
        return (
            <div className="py-12 animate-in zoom-in-95 duration-500">
                <EmptyState
                    icon={<Handshake size={56} className="mx-auto mb-6 text-blue-500 opacity-80" />}
                    title="Exhibition Matches"
                    message="Friendly matches are played for practice or exhibition. No official points table is maintained."
                    subtitle="You can still view the history of all matches played."
                />
                
                <div className="flex justify-center mt-8">
                    <button 
                        onClick={() => onNavigate?.('results')} // Switch to Results tab
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
        const currentRows = groupData.find(g => g.groupName === activeGroup)?.rows || [];

        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/20 p-4 rounded-xl border border-border">
                    <div>
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Users className="text-primary" size={20} /> Group Stage
                        </h2>
                    </div>

                    {/* Styled Group Selector */}
                    <div className="flex p-1 bg-background rounded-lg border border-border shadow-sm">
                        {groupData.map((group) => (
                            <button
                                key={group.groupName}
                                onClick={() => setActiveGroup(group.groupName)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                                    activeGroup === group.groupName 
                                    ? "bg-primary text-primary-foreground shadow-md" 
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                                {group.groupName}
                            </button>
                        ))}
                    </div>
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
                
                {/* Search Input */}
                <div className="hidden sm:block relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                     <input 
                        type="text" 
                        placeholder="Search team..." 
                        className="h-9 pl-9 pr-4 rounded-full bg-card border border-border text-xs w-48 focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    />
                </div>
            </div>
            
            <TableView data={leagueData} />
        </div>
    );
}