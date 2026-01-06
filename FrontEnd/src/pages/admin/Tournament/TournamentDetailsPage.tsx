import { useEffect, useState } from 'react';
import {
    MapPin, Trophy, Mail, Phone, ChevronRight, MoreVertical, Ban,
    AlertCircle, Users, DollarSign, Clock, FileText, Globe,
    CheckCircle
} from 'lucide-react';
import AdminLayout from '../../layout/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchTournamentDetails,
    updateTournamentStatus
} from '../../../features/admin/tournament/tournamentThunks';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import LoadingOverlay from '../../../components/shared/LoadingOverlay';
import { DetailItem } from '../../../components/admin/shared/DetailItem';

const TournamentDetailsPage = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'rules'>('overview');
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { selectedTournament, loading } = useAppSelector((state) => state.adminTournaments);

    useEffect(() => {
        if (id) {
            dispatch(fetchTournamentDetails(id));
        }
    }, [dispatch, id]);

    const handleStatusToggle = () => {
        if (!selectedTournament || !id) return;

        const isCurrentlyBlocked = selectedTournament.isBlocked === true;

        const newStatus = isCurrentlyBlocked ? false : true;

        dispatch(updateTournamentStatus({ id, status: newStatus }));
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'teams', label: 'Registered Teams' },
        { id: 'rules', label: 'Rules & Settings' },
    ];

    // --- 1. Loading State ---
    if (loading && !selectedTournament) {
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
    if (!selectedTournament) {
        return (
            <AdminLayout>
                <div className="bg-background flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                    <h2 className="text-lg font-medium text-foreground">Tournament not found</h2>
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


    return (
        <>
            <LoadingOverlay show={loading} />

            <AdminLayout>
                <div className="bg-background text-foreground mt-2 pb-10">

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
                                    <h2 className="text-sm font-medium text-muted-foreground">Tournaments</h2>
                                    <p className="text-xs text-muted-foreground/70">ID: {selectedTournament.tourId}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleStatusToggle}
                                    disabled={loading || selectedTournament.status === 'cancelled'}
                                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border transition-all disabled:opacity-50 disabled:cursor-not-allowed
                                            ${selectedTournament.isBlocked
                                            ? 'text-green-600 bg-green-500/10 hover:bg-green-500/20 border-green-500/20'
                                            : 'text-destructive bg-destructive/10 hover:bg-destructive/20 border-destructive/20'
                                        }`}
                                >
                                    {selectedTournament.isBlocked ? (
                                        <> <CheckCircle className="w-4 h-4" /> Unblock Tournament </>
                                    ) : (
                                        <> <Ban className="w-4 h-4" /> Block Tournament </>
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

                        {/* Banner & Header Details */}
                        <div className="bg-card rounded-xl border border-border overflow-hidden mb-8 shadow-sm">
                            {/* Banner Image */}
                            <div className="h-48 w-full bg-muted relative">
                                <img
                                    src={selectedTournament.banner || 'https://via.placeholder.com/1200x300'}
                                    alt={selectedTournament.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-6 text-white">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h1 className="text-3xl font-bold shadow-sm">{selectedTournament.title}</h1>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        <span className="truncate max-w-lg">{selectedTournament.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Bar */}
                            <div className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-card">
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">

                                    <div className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 rounded-md border border-border/50 text-secondary-foreground uppercase font-bold text-xs tracking-wide">
                                        <Trophy className="w-3.5 h-3.5" />
                                        <span>{selectedTournament.sport}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 border-l border-border pl-4">
                                        <Users className="w-4 h-4" />
                                        {selectedTournament.playersPerTeam} Players / Team
                                    </div>
                                    <div className="flex items-center gap-1.5 border-l border-border pl-4">
                                        <Globe className="w-4 h-4" />
                                        {selectedTournament.format}
                                    </div>
                                </div>

                                {/* Date Box */}
                                <div className="flex gap-6 text-right">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Start Date</p>
                                        <p className="font-medium text-foreground">{new Date(selectedTournament.startDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="border-l border-border pl-6">
                                        <p className="text-xs text-muted-foreground">Reg. Deadline</p>
                                        <p className="font-medium text-destructive">{new Date(selectedTournament.regDeadline).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-8 mb-6 border-b border-border">
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

                        {/* --- TAB CONTENT --- */}

                        {/* OVERVIEW */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Quick Stats Row */}
                                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard
                                        label="Prize Pool"
                                        value={selectedTournament.prizePool.toLocaleString()}
                                        prefix="₹"
                                        icon={<Trophy className="w-4 h-4 text-yellow-500" />}
                                    />
                                    <StatCard
                                        label="Entry Fee"
                                        value={selectedTournament.entryFee}
                                        prefix="₹"
                                        icon={<DollarSign className="w-4 h-4 text-green-500" />}
                                    />
                                    <StatCard
                                        label="Teams Registered"
                                        value={`${selectedTournament.currTeams} / ${selectedTournament.maxTeams}`}
                                        subtext={`Min required: ${selectedTournament.minTeams}`}
                                        icon={<Users className="w-4 h-4 text-blue-500" />}
                                    />
                                    <StatCard
                                        label="Duration"
                                        value={`${Math.ceil((new Date(selectedTournament.endDate).getTime() - new Date(selectedTournament.startDate).getTime()) / (1000 * 60 * 60 * 24))} Days`}
                                        subtext="Estimated"
                                        icon={<Clock className="w-4 h-4 text-purple-500" />}
                                    />
                                </div>

                                {/* Main Description & Details */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-foreground mb-4">About Tournament</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {selectedTournament.description}
                                        </p>
                                    </div>

                                    {/* Rules Preview (if brief) */}
                                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> Rules Highlight
                                        </h3>
                                        <ul className="list-disc list-inside space-y-2">
                                            {selectedTournament.rules.slice(0, 3).map((rule, idx) => (
                                                <li key={idx} className="text-sm text-muted-foreground">{rule}</li>
                                            ))}
                                            {selectedTournament.rules.length > 3 && (
                                                <li className="text-sm text-primary cursor-pointer hover:underline pt-2" onClick={() => setActiveTab('rules')}>
                                                    View all {selectedTournament.rules.length} rules...
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* Right Column: Metadata & Organizer */}
                                <div className="space-y-6">
                                    {/* Organizer Card */}
                                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Organizer</h3>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {selectedTournament.organizer ? selectedTournament.organizer.charAt(0) : 'O'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{selectedTournament.organizer}</p>
                                                <p className="text-xs text-muted-foreground">ID: {selectedTournament.managerId.substring(0, 8)}...</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {selectedTournament.contact.email && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    {selectedTournament.contact.email}
                                                </div>
                                            )}
                                            {selectedTournament.contact.phone && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    {selectedTournament.contact.phone}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* System Metadata */}
                                    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">System Details</h3>
                                        <div className="space-y-4">
                                            <DetailItem label="Database ID" value={selectedTournament._id} copyable />
                                            <DetailItem label="Created At" value={new Date(selectedTournament.createdAt).toLocaleDateString()} />
                                            <DetailItem label="Last Update" value={new Date(selectedTournament.updatedAt || selectedTournament.createdAt).toLocaleDateString()} />
                                            <DetailItem label="Coordinates" value={`${selectedTournament.latitude.toFixed(4)}, ${selectedTournament.longitude.toFixed(4)}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TEAMS LIST PLACEHOLDER */}
                        {activeTab === 'teams' && (
                            <div className="bg-card border border-border rounded-xl p-8 text-center">
                                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                <h3 className="text-lg font-medium text-foreground">Registered Teams</h3>
                                <p className="text-muted-foreground mb-4">
                                    {selectedTournament.currTeams} teams are currently registered for this tournament.
                                </p>
                                {/* Implement Team List Table here based on your API response for teams */}
                            </div>
                        )}

                        {/* RULES TAB */}
                        {activeTab === 'rules' && (
                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-foreground mb-6">Tournament Rules & Regulations</h3>
                                <div className="space-y-4">
                                    {selectedTournament.rules.map((rule, idx) => (
                                        <div key={idx} className="flex gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                                                {idx + 1}
                                            </div>
                                            <p className="text-sm text-foreground/80">{rule}</p>
                                        </div>
                                    ))}
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

const StatCard = ({ label, value, prefix = "", subtext, icon }: { label: string, value: string | number, prefix?: string, subtext?: string, icon?: React.ReactNode }) => (
    <div className="bg-card p-4 rounded-xl border border-border hover:border-primary/50 transition-colors group shadow-sm flex flex-col justify-between">
        <div>
            <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                {icon && <div className="opacity-70">{icon}</div>}
            </div>
            <div className="flex items-baseline gap-1">
                {prefix && <span className="text-sm text-muted-foreground font-medium">{prefix}</span>}
                <span className="text-2xl font-bold text-foreground">{value}</span>
            </div>
        </div>
        {subtext && <p className="text-xs text-muted-foreground/80 mt-2 border-t border-border pt-2">{subtext}</p>}
    </div>
);

export default TournamentDetailsPage;