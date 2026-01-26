import { useState, useMemo } from 'react';
import { Search, MapPin, Calendar, Trophy, CircleDot } from 'lucide-react';
import Navbar from '../../components/manager/Navbar';

// --- Mock Data: Cricket Specific ---
const MOCK_MATCHES = [
    {
        id: 1,
        status: 'live',
        league: 'T20 Premier League',
        matchType: 'T20',
        teamA: { name: 'Royal Strikers', logo: '🦁', score: '185/6', overs: '20.0' },
        teamB: { name: 'Kings XI', logo: '👑', score: '172/4', overs: '18.4' },
        note: 'Kings XI need 14 runs in 8 balls',
        venue: 'Eden Gardens',
    },
    {
        id: 2,
        status: 'upcoming',
        league: 'Champions Trophy',
        matchType: 'ODI',
        teamA: { name: 'Blue Titans', logo: '🔵' },
        teamB: { name: 'Green Warriors', logo: '🟢' },
        date: '2025-10-15',
        time: '14:30 PM',
        venue: 'Melbourne Cricket Ground',
    },
    {
        id: 3,
        status: 'completed',
        league: 'Super Smash Series',
        matchType: 'T20',
        teamA: { name: 'Thunderbolts', logo: '⚡', score: '142/10', overs: '18.2' },
        teamB: { name: 'Hurricanes', logo: '🌀', score: '145/3', overs: '16.1' },
        date: '2025-10-10',
        winner: 'teamB',
        resultText: 'Hurricanes won by 7 wickets',
    },
    {
        id: 4,
        status: 'live',
        league: 'Test Championship',
        matchType: 'TEST',
        teamA: { name: 'Red Dragons', logo: '🐉', score: '350 & 120/2', overs: 'Day 4' },
        teamB: { name: 'Iron Wolves', logo: '🐺', score: '280', overs: '' },
        note: 'Dragons lead by 190 runs',
        venue: 'Lords',
    },
    {
        id: 5,
        status: 'upcoming',
        league: 'Charity Shield',
        matchType: 'T10',
        teamA: { name: 'Pixel Pioneers', logo: '👾' },
        teamB: { name: 'Glitch Mob', logo: '📺' },
        date: '2025-10-16',
        time: '19:00 PM',
        venue: 'Oval Stadium',
    },
];

const MatchCard = ({ match }) => {
    const isLive = match.status === 'live';
    const isUpcoming = match.status === 'upcoming';
    const isCompleted = match.status === 'completed';

    return (
        <div className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-all hover:border-primary/50 hover:shadow-md">

            {/* Header: League & Status Indicator */}
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
                        {match.matchType}
                    </span>
                    <span className="uppercase tracking-wide opacity-80 truncate max-w-[120px]">
                        {match.league}
                    </span>
                </div>

                {isLive && (
                    <span className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-0.5 text-destructive animate-pulse">
                        <CircleDot size={12} className="fill-current" /> LIVE
                    </span>
                )}
                {isUpcoming && (
                    <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">
                        <Calendar size={12} /> {match.date}
                    </span>
                )}
                {isCompleted && (
                    <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground">
                        Result
                    </span>
                )}
            </div>

            {/* Teams & Scores Layout */}
            <div className="flex items-center justify-between py-1">
                {/* Team A */}
                <div className="flex flex-col items-center gap-2 text-center w-[35%]">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl shadow-inner ${isCompleted && match.winner === 'teamA' ? 'bg-primary/10 ring-2 ring-primary' : 'bg-secondary'}`}>
                        {match.teamA.logo}
                    </div>
                    <span className="text-sm font-bold leading-tight line-clamp-1">
                        {match.teamA.name}
                    </span>
                    {!isUpcoming && (
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-foreground">{match.teamA.score}</span>
                            <span className="text-xs text-muted-foreground">({match.teamA.overs})</span>
                        </div>
                    )}
                </div>

                {/* Center Info (VS or Status) */}
                <div className="flex flex-col items-center justify-center w-[30%] text-center">
                    {isUpcoming ? (
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xl font-black text-muted-foreground/30">VS</span>
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md whitespace-nowrap">
                                {match.time}
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-xs font-bold text-muted-foreground/50 uppercase tracking-widest">
                                {isLive ? 'Playing' : 'Ended'}
                            </span>
                            {/* Live Match Situation Text (e.g. "Need 12 off 6") */}
                            {match.note && (
                                <span className="text-[10px] leading-3 font-medium text-primary text-center px-1">
                                    {match.note}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Team B */}
                <div className="flex flex-col items-center gap-2 text-center w-[35%]">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl shadow-inner ${isCompleted && match.winner === 'teamB' ? 'bg-primary/10 ring-2 ring-primary' : 'bg-secondary'}`}>
                        {match.teamB.logo}
                    </div>
                    <span className="text-sm font-bold leading-tight line-clamp-1">
                        {match.teamB.name}
                    </span>
                    {!isUpcoming && (
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-foreground">{match.teamB.score}</span>
                            <span className="text-xs text-muted-foreground">({match.teamB.overs})</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer: Details */}
            <div className="mt-auto border-t border-border pt-3">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    {isCompleted ? (
                        <>
                            <Trophy size={14} className="text-yellow-500" />
                            <span className="font-medium text-foreground">{match.resultText}</span>
                        </>
                    ) : (
                        <>
                            <MapPin size={14} />
                            <span className="truncate max-w-[200px]">{match.venue}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const MatchesSection = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMatches = useMemo(() => {
        return MOCK_MATCHES.filter((match) => {
            const matchesTab = activeTab === 'all' || match.status === activeTab;
            const matchesSearch =
                match.teamA.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                match.teamB.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                match.league.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesTab && matchesSearch;
        });
    }, [activeTab, searchQuery]);

    const tabs = [
        { id: 'all', label: 'All Matches' },
        { id: 'live', label: 'Live Scores' },
        { id: 'upcoming', label: 'Fixtures' },
        { id: 'completed', label: 'Results' },
    ];

    return (
        <>
            <Navbar />
            <section className="bg-background p-6 text-foreground md:px-12">
                <div className="mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Matches Center</h2>
                            <p className="mt-1 text-muted-foreground">Live scores, fixtures, and match results.</p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search teams or series..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="border-b border-border">
                        <div className="flex gap-6 overflow-x-auto pb-px">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative whitespace-nowrap pb-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'text-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Matches Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredMatches.length > 0 ? (
                            filteredMatches.map((match) => (
                                <MatchCard key={match.id} match={match} />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-muted-foreground">
                                <p>No matches found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default MatchesSection;