import {
    ArrowLeft, Calendar,
    MapPin, Users,
    Trophy, UserCog,
    Edit, Share,
    Download, Info,
    CalendarDays,
    Swords, Trophy as TrophyIcon,
    UsersRound, BarChart3,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../manager/Navbar";

type TabType =
    | "info"
    | "teams"
    | "fixtures"
    | "matches"
    | "results"
    | "groups"
    | "leaderboard";

export default function TournamentDetailsPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>("info");

    // Sample tournament data
    const tournamentData = {
        id: "1",
        title: "All Kerala Cricket League Cup",
        description:
            "The premier cricket tournament showcasing the best talent from across Kerala. This championship brings together top teams competing for the coveted trophy and substantial prize pool.",
        sport: "Cricket",
        startDate: "15 January 2025",
        endDate: "30 January 2025",
        registrationDeadline: "10 January 2025",
        location: "Sports Complex, Kochi",
        maxParticipants: 16,
        minParticipants: 8,
        currentParticipants: 14,
        entryFee: "₹1000",
        format: "Group Stage + Playoffs",
        pricePool: "₹50,000",
        status: "Ongoing" as const,
        organizer: "Kerala Sports Association",
        contactEmail: "contact@ksa.org",
        contactPhone: "+91 9876543210",
        rules: [
            "All matches will be played as per ICC rules",
            "Teams must register before the deadline",
            "Entry fee is non-refundable",
            "Minimum 12 players per squad required",
        ],
    };

    const registeredTeams = [
        {
            name: "Kochi Kings",
            captain: "Rahul Sharma",
            registeredOn: "05 Jan 2025",
        },
        {
            name: "Trivandrum Titans",
            captain: "Vikram Nair",
            registeredOn: "06 Jan 2025",
        },
        {
            name: "Kozhikode Warriors",
            captain: "Arjun Menon",
            registeredOn: "07 Jan 2025",
        },
        {
            name: "Thrissur Lions",
            captain: "Suresh Kumar",
            registeredOn: "08 Jan 2025",
        },
    ];

    const tabs = [
        { id: "info" as const, label: "Information", icon: Info },
        { id: "teams" as const, label: "Teams", icon: UserCog },
        { id: "fixtures" as const, label: "Fixtures", icon: CalendarDays },
        { id: "matches" as const, label: "Matches", icon: Swords },
        { id: "results" as const, label: "Results", icon: TrophyIcon },
        { id: "groups" as const, label: "Groups", icon: UsersRound },
        { id: "leaderboard" as const, label: "Leaderboard", icon: BarChart3 },
    ];

    // Tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case "info":
                return (
                    <InfoTab
                        tournamentData={tournamentData}
                        registeredTeams={registeredTeams}
                    />
                );
            case "teams":
                return <TeamsTab registeredTeams={registeredTeams} />;
            case "fixtures":
                return <FixturesTab />;
            case "matches":
                return <MatchesTab />;
            case "results":
                return <ResultsTab />;
            case "groups":
                return <GroupsTab />;
            case "leaderboard":
                return <LeaderboardTab />;
            default:
                return (
                    <InfoTab
                        tournamentData={tournamentData}
                        registeredTeams={registeredTeams}
                    />
                );
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-neutral-900 text-white p-8 mt-10 mx-12">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 transition-all duration-200 group"
                    >
                        <ArrowLeft
                            size={20}
                            className="group-hover:-translate-x-1 transition-transform"
                        />
                    </button>
                    <div className="h-6 w-px bg-neutral-700/50" />
                    <h1 className="text-2xl font-bold">Tournament Details</h1>
                </div>

                {/* Tournament Header */}
                <div className="bg-gradient-to-br from-green-900/20 to-emerald-800/10 backdrop-blur-sm rounded-2xl border border-green-700/30 p-6 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{tournamentData.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-neutral-300">
                                <span className="flex items-center gap-1">
                                    <Trophy size={16} className="text-amber-400" />
                                    {tournamentData.sport}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar size={16} className="text-blue-400" />
                                    {tournamentData.startDate} - {tournamentData.endDate}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${tournamentData.status === "Ongoing"
                                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                        : "bg-neutral-600/20 text-neutral-300 border border-neutral-600/30"
                                        }`}
                                >
                                    {tournamentData.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                <Edit size={18} />
                            </button>
                            <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                <Share size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="flex">
                        <div className="flex justify-between w-full bg-neutral-800/30 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-2">
                            {tabs.map((tab) => {
                                const IconComponent = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                                            : "text-neutral-400 hover:text-white hover:bg-neutral-700/50"
                                            }`}
                                    >
                                        <IconComponent size={18} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="animate-fade-in">{renderTabContent()}</div>
            </div>
        </>
    );
}

/* ---------------- Tabs ---------------- */

function InfoTab({
    tournamentData,
    registeredTeams,
}: {
    tournamentData: any;
    registeredTeams: any[];
}) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div className="bg-neutral-800/30 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
                    <h2 className="text-xl font-semibold mb-4">Description</h2>
                    <p className="text-neutral-300 leading-relaxed">
                        {tournamentData.description}
                    </p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-800/30 rounded-2xl border border-neutral-700/50 p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Trophy className="text-amber-400" size={20} />
                            Tournament Information
                        </h2>
                        <div className="space-y-4">
                            <DetailRow label="Format" value={tournamentData.format} />
                            <DetailRow
                                label="Entry Fee"
                                value={tournamentData.entryFee}
                                highlight="text-green-400"
                            />
                            <DetailRow
                                label="Price Pool"
                                value={tournamentData.pricePool}
                                highlight="text-amber-400"
                            />
                        </div>
                    </div>

                    <div className="bg-neutral-800/30 rounded-2xl border border-neutral-700/50 p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="text-blue-400" size={20} />
                            Schedule & Venue
                        </h2>
                        <div className="space-y-4">
                            <DetailRow
                                label="Registration Deadline"
                                value={tournamentData.registrationDeadline}
                            />
                            <DetailRow
                                label="Location"
                                value={tournamentData.location}
                                icon={<MapPin size={18} className="text-purple-400" />}
                            />
                        </div>
                    </div>
                </div>

                {/* Rules */}
                <div className="bg-neutral-800/30 rounded-2xl border border-neutral-700/50 p-6">
                    <h2 className="text-xl font-semibold mb-4">Rules & Regulations</h2>
                    <ul className="space-y-2">
                        {tournamentData.rules.map((rule: string, i: number) => (
                            <li
                                key={i}
                                className="flex items-start gap-3 text-neutral-300"
                            >
                                <span className="text-green-400 mt-1">•</span>
                                {rule}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Stats */}
            <TournamentStats tournamentData={tournamentData} />
        </div>
    );
}

function TeamsTab({ registeredTeams }: { registeredTeams: any[] }) {
    return (
        <div className="bg-neutral-800/30 rounded-2xl border border-neutral-700/50 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Users className="text-green-400" size={20} />
                    Registered Teams ({registeredTeams.length})
                </h2>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition-colors">
                    <Download size={16} />
                    Export List
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registeredTeams.map((team, i) => (
                    <div
                        key={i}
                        className="bg-neutral-700/20 rounded-xl p-4 border border-neutral-600/30"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{team.name}</h3>
                            <span className="text-xs bg-neutral-600/50 px-2 py-1 rounded">
                                #{i + 1}
                            </span>
                        </div>
                        <div className="text-sm text-neutral-400">
                            <div>Captain: {team.captain}</div>
                            <div>Registered: {team.registeredOn}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FixturesTab() {
    return (
        <EmptyState
            icon={<CalendarDays size={48} className="mx-auto mb-4 text-blue-400" />}
            title="Tournament Fixtures"
            message="Fixtures will be available soon"
            subtitle="Check back after registration closes"
        />
    );
}

function MatchesTab() {
    return (
        <EmptyState
            icon={<Swords size={48} className="mx-auto mb-4 text-green-400" />}
            title="Live & Upcoming Matches"
            message="Matches schedule coming soon"
            subtitle="Matches will appear here once fixtures are generated"
        />
    );
}

function ResultsTab() {
    return (
        <EmptyState
            icon={<TrophyIcon size={48} className="mx-auto mb-4 text-amber-400" />}
            title="Match Results"
            message="Results will be posted after matches"
            subtitle="Check back during the tournament"
        />
    );
}

function GroupsTab() {
    return (
        <EmptyState
            icon={<UsersRound size={48} className="mx-auto mb-4 text-purple-400" />}
            title="Tournament Groups"
            message="Groups will be formed after registration"
            subtitle="Groups will be announced soon"
        />
    );
}

function LeaderboardTab() {
    return (
        <EmptyState
            icon={<BarChart3 size={48} className="mx-auto mb-4 text-red-400" />}
            title="Tournament Leaderboard"
            message="Leaderboard will update during the tournament"
            subtitle="Standings will appear here once matches start"
        />
    );
}

/* ---------------- Reusable helpers ---------------- */

function TournamentStats({ tournamentData }: { tournamentData: any }) {
    return (
        <div className="bg-neutral-800/30 rounded-2xl border border-neutral-700/50 p-6">
            <h3 className="text-lg font-semibold mb-4">Tournament Stats</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Registration Progress</span>
                    <span className="font-medium">
                        {tournamentData.currentParticipants}/{tournamentData.maxParticipants}
                    </span>
                </div>
                <div className="w-full bg-neutral-700/50 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                        style={{
                            width: `${(tournamentData.currentParticipants /
                                tournamentData.maxParticipants) *
                                100
                                }%`,
                        }}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-neutral-700/30 rounded-xl p-3">
                        <div className="text-2xl font-bold text-green-400">
                            {tournamentData.currentParticipants}
                        </div>
                        <div className="text-xs text-neutral-400">Teams</div>
                    </div>
                    <div className="bg-neutral-700/30 rounded-xl p-3">
                        <div className="text-2xl font-bold text-blue-400">4</div>
                        <div className="text-xs text-neutral-400">Groups</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EmptyState({
    icon,
    title,
    message,
    subtitle,
}: {
    icon: React.ReactNode;
    title: string;
    message: string;
    subtitle: string;
}) {
    return (
        <div className="bg-neutral-800/30 rounded-2xl border border-neutral-700/50 p-6 text-center py-12">
            {icon}
            <h2 className="text-2xl font-semibold mb-2">{title}</h2>
            <p className="text-lg">{message}</p>
            <p className="text-sm text-neutral-400 mt-2">{subtitle}</p>
        </div>
    );
}

function DetailRow({
    label,
    value,
    highlight,
    icon,
}: {
    label: string;
    value: string;
    highlight?: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-neutral-700/30">
            <span className="text-neutral-400 flex items-center gap-2">
                {icon}
                {label}
            </span>
            <span className={`font-medium ${highlight || ""}`}>{value}</span>
        </div>
    );
}
