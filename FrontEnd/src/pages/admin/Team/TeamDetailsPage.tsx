import { useEffect, useState } from 'react';
import {
    MapPin, Trophy, Calendar, Mail, Shield, ChevronRight, MoreVertical, Ban,
    CheckCircle, Search, AlertCircle
} from 'lucide-react';
import AdminLayout from '../../layout/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchTeamDetails,
    updateTeamStatus
} from '../../../features/admin/tournament/tournamentThunks';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import LoadingOverlay from '../../../components/shared/LoadingOverlay';
import type { AdminTeamMember } from '../../../features/admin/tournament/tournamentTypes';
import { DetailItem, StatusBadge } from '../../../components/admin/shared/DetailItem';
import { PlayerCard } from '../../../components/admin/shared/PlayerCard';

const TeamDetailsPage = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'squad'>('overview');
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { selectedTeam, loading } = useAppSelector((state) => state.adminTournaments);

    useEffect(() => {
        if (id) {
            dispatch(fetchTeamDetails(id));
        }
    }, [dispatch, id]);

    const handleStatusToggle = () => {
        if (!selectedTeam || !id) return;
        const newStatus = selectedTeam.status === 'active' ? 'blocked' : 'active';
        dispatch(updateTeamStatus({ id, status: newStatus }));
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'squad', label: 'Roster' },
    ];

    // --- 1. Loading State ---
    if (loading && !selectedTeam) {
        return (
            <>
                <LoadingOverlay show={true} />
                <AdminLayout>
                    <div className="min-h-screen bg-background" />
                </AdminLayout>
            </>
        );
    }

    // --- 2. Error/Empty State ---
    if (!selectedTeam) {
        return (
            <AdminLayout>
                <div className="bg-background flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                    <h2 className="text-lg font-medium text-foreground">Team not found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 text-primary hover:underline"
                    >
                        Go Back
                    </button>
                </div>
            </AdminLayout>
        );
    }

    // --- 3. Main Render ---
    return (
        <>
            <LoadingOverlay show={loading} />

            <AdminLayout>
                <div className="bg-background text-foreground mt-2">

                    {/* --- Admin Action Header --- */}
                    <div className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="p-2 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180" />
                                </button>
                                <div>
                                    <h2 className="text-sm font-medium text-muted-foreground">Teams</h2>
                                    <p className="text-xs text-muted-foreground/70">ID: {selectedTeam.teamId}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleStatusToggle}
                                    disabled={loading}
                                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all disabled:opacity-50
                                    ${selectedTeam.status === 'active'
                                            ? 'text-destructive bg-destructive/10 hover:bg-destructive/20 border-destructive/20'
                                            : 'text-green-600 dark:text-green-500 bg-green-500/10 hover:bg-green-500/20 border-green-500/20'
                                        }`}
                                >
                                    {selectedTeam.status === 'active' ? (
                                        <> <Ban className="w-4 h-4" /> Block Team </>
                                    ) : (
                                        <> <CheckCircle className="w-4 h-4" /> Unblock / Verify </>
                                    )}
                                </button>

                                <button className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-accent-foreground">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- Content Wrapper --- */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                        {/* Header Details Card */}
                        <div className="bg-card rounded-xl border border-border p-6 mb-8 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-6 md:items-start">

                                {/* Logo */}
                                <div className="w-24 h-24 rounded-lg bg-muted p-2 border border-border shrink-0">
                                    <img
                                        src={selectedTeam.logo || 'https://via.placeholder.com/150'}
                                        alt={selectedTeam.name}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h1 className="text-2xl font-bold text-foreground">{selectedTeam.name}</h1>
                                                <StatusBadge status={selectedTeam.status} />
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md border border-border/50 text-secondary-foreground">
                                                    <Trophy className="w-3.5 h-3.5" />
                                                    <span>{selectedTeam.sport}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-4 h-4" />
                                                    {selectedTeam.city}, {selectedTeam.state}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    Joined {new Date(selectedTeam.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm text-muted-foreground max-w-3xl leading-relaxed">
                                        {selectedTeam.description || "No description provided."}
                                    </p>
                                </div>

                                {/* Manager/Owner Mini Card */}
                                <div className="w-full md:w-72 bg-muted/30 rounded-lg p-4 border border-border">
                                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Managed By</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                            {selectedTeam.managerName ? selectedTeam.managerName.charAt(0) : 'M'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {selectedTeam.managerName || "Unknown Manager"}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">ID: {selectedTeam.managerId}</p>
                                        </div>
                                        <button className="p-1.5 hover:bg-background rounded text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all">
                                            <Mail className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center gap-8 mt-8 border-b border-border">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as 'overview')}
                                        className={`
                                            pb-3 text-sm font-medium border-b-2 transition-all duration-200
                                            ${activeTab === tab.id
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}
                                        `}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* --- TAB CONTENT --- */}

                        {/* OVERVIEW */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Quick Stats */}
                                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <StatCard label="Total Matches" value={selectedTeam.stats?.totalMatches || 0} trend="Season Total" />
                                    <StatCard label="Win Rate" value={`${selectedTeam.stats?.winRate || 0}%`} trend={`${selectedTeam.stats?.wins || 0} Wins`} />
                                    <StatCard label="Squad Size" value={`${selectedTeam.membersCount || 0}/${selectedTeam.maxPlayers}`} trend="Recruiting" />
                                    <StatCard label="Phase" value={selectedTeam.phase || 'N/A'} trend="Current Status"/>
                                </div>

                                {/* Admin Metadata Box */}
                                <div className="lg:col-span-3">
                                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                                        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-primary" />
                                            Administrative Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            <DetailItem label="Database ID" value={selectedTeam._id} copyable />
                                            <DetailItem label="Team ID" value={selectedTeam.teamId} copyable />
                                            <DetailItem label="Status" value={selectedTeam.status} status={selectedTeam.status} isBadge />
                                            <DetailItem label="Created At" value={new Date(selectedTeam.createdAt).toLocaleDateString()} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SQUAD / ROSTER */}
                        {activeTab === 'squad' && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="Search player..."
                                            className="bg-background border border-input pl-9 pr-4 py-2 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/10 text-green-600 dark:text-green-500 border border-green-500/20">Playing: {selectedTeam.members?.filter((m) => m.status === 'playing').length || 0}</span>
                                        <span className="text-xs font-medium px-2 py-1 rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 border border-yellow-500/20">Sub: {selectedTeam.members?.filter((m) => m.status !== 'playing').length || 0}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {selectedTeam.members && selectedTeam.members.length > 0 ? (
                                        selectedTeam.members.map((member: AdminTeamMember, idx: number) => (
                                            <PlayerCard key={idx} member={member} />
                                        ))
                                    ) : (
                                        <div className="col-span-3 text-center py-8 text-muted-foreground">No players in this team yet.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </>
    );
};

// --- Sub-Components ---



const StatCard = ({ label, value, trend }: { label: string, value: string | number, trend: string }) => (
    <div className="bg-card p-4 rounded-xl border border-border hover:border-primary/50 transition-colors group shadow-sm">
        <p className="text-xs font-medium text-muted-foreground uppercase">{label}</p>
        <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{value}</span>
        </div>
        <p className="text-xs text-muted-foreground/80 mt-1">{trend}</p>
    </div>
);




export default TeamDetailsPage;