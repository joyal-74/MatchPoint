import { useState } from 'react';
import { 
    Calendar, MapPin, Search, ArrowRight, Trophy, 
    Filter, Clock, CloudRain, Sun, Wind, 
    Download, Eye
} from 'lucide-react';
import Navbar from '../../components/manager/Navbar';

// --- Mock Data ---
const UPCOMING_MATCHES = [
    {
        id: 1,
        league: 'T20 Premier League',
        round: 'Semi Final',
        teamA: { name: 'Royal Strikers', short: 'RST', logo: '🦁' },
        teamB: { name: 'Kings XI', short: 'KXI', logo: '👑' },
        date: '24 Oct',
        time: '19:00',
        venue: 'Eden Gardens',
        weather: 'Clear',
    },
    {
        id: 2,
        league: 'T20 Premier League',
        round: 'Final (If Qualify)',
        teamA: { name: 'Royal Strikers', short: 'RST', logo: '🦁' },
        teamB: { name: 'TBD', short: 'TBD', logo: '❓' },
        date: '28 Oct',
        time: '20:00',
        venue: 'Wankhede',
        weather: 'Cloudy',
    },
    {
        id: 3,
        league: 'Winter Test',
        round: 'Day 1',
        teamA: { name: 'Royal Strikers', short: 'RST', logo: '🦁' },
        teamB: { name: 'Iron Wolves', short: 'IRW', logo: '🐺' },
        date: '02 Nov',
        time: '09:30',
        venue: 'The Oval',
        weather: 'Rain',
    }
];

const HISTORY_MATCHES = [
    {
        id: 101,
        result: 'won',
        date: 'Oct 20, 2025',
        league: 'T20 Premier League',
        opponent: { name: 'Green Warriors', short: 'GRW', logo: '🟢', score: '145/8 (20)' },
        myTeam: { name: 'Royal Strikers', short: 'RST', logo: '🦁', score: '148/4 (18.2)' },
        margin: 'Won by 6 wickets',
        mom: 'V. Kohli',
        venue: 'Chinnaswamy Stadium'
    },
    {
        id: 102,
        result: 'lost',
        date: 'Oct 15, 2025',
        league: 'Charity Cup',
        opponent: { name: 'Red Dragons', short: 'RDD', logo: '🐉', score: '180/5 (20)' },
        myTeam: { name: 'Royal Strikers', short: 'RST', logo: '🦁', score: '165/9 (20)' },
        margin: 'Lost by 15 runs',
        mom: null,
        venue: 'Dubai Intl Stadium'
    },
    {
        id: 103,
        result: 'won',
        date: 'Oct 10, 2025',
        league: 'Warm-up Match',
        opponent: { name: 'Academy XI', short: 'ACA', logo: '🎓', score: '120/10 (18.4)' },
        myTeam: { name: 'Royal Strikers', short: 'RST', logo: '🦁', score: '121/0 (12.1)' },
        margin: 'Won by 10 wickets',
        mom: 'R. Sharma',
        venue: 'NCA Ground'
    },
    {
        id: 104,
        result: 'draw',
        date: 'Oct 05, 2025',
        league: '3-Day Practice',
        opponent: { name: 'County XI', short: 'CNTY', logo: '🏏', score: '300 & 150/5' },
        myTeam: { name: 'Royal Strikers', short: 'RST', logo: '🦁', score: '280 & 200/4' },
        margin: 'Match Drawn',
        mom: null,
        venue: 'County Ground'
    },
];

// --- Sub-Components ---

const WeatherIcon = ({ type }) => {
    if (type === 'Rain') return <CloudRain size={14} className="text-blue-400" />;
    if (type === 'Cloudy') return <Wind size={14} className="text-muted-foreground" />;
    return <Sun size={14} className="text-yellow-500" />;
};

const FixtureCard = ({ match }) => (
    <div className="relative min-w-[300px] flex-shrink-0 overflow-hidden rounded-xl border border-border bg-card p-0 transition-all hover:border-primary/50 hover:shadow-md group">
        {/* Top Strip */}
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3 group-hover:bg-primary/5 transition-colors">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {match.league}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <Calendar size={12} className="text-primary" />
                {match.date}
            </div>
        </div>

        {/* Teams Content */}
        <div className="flex items-center justify-between p-5">
            <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-2xl shadow-sm border border-border">
                    {match.teamA.logo}
                </div>
                <span className="font-bold text-sm">{match.teamA.short}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
                <div className="rounded bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {match.time}
                </div>
                <span className="text-[10px] text-muted-foreground font-medium mt-1">VS</span>
            </div>

            <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-2xl shadow-sm border border-border">
                    {match.teamB.logo}
                </div>
                <span className="font-bold text-sm">{match.teamB.short}</span>
            </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground bg-muted/10">
            <div className="flex items-center gap-1.5">
                <MapPin size={12} />
                <span className="truncate max-w-[100px]">{match.venue}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <WeatherIcon type={match.weather} />
                <span>{match.weather}</span>
            </div>
        </div>
    </div>
);

// --- New "Match Report Strip" History Design ---
const MatchResultRow = ({ match }) => {
    const isWin = match.result === 'won';
    const isLoss = match.result === 'lost';
    
    // Dynamic Styles based on result
    const resultColor = isWin ? 'text-green-600' : isLoss ? 'text-destructive' : 'text-orange-500';
    const resultBadgeBg = isWin ? 'bg-green-500/10' : isLoss ? 'bg-destructive/10' : 'bg-orange-500/10';
    
    return (
        <div className="group grid grid-cols-1 md:grid-cols-12 items-center gap-4 border-b border-border py-4 last:border-0 hover:bg-muted/30 px-4 transition-colors cursor-pointer">
            
            {/* Col 1: Date & League (Width: 3/12) */}
            <div className="md:col-span-3 flex flex-row md:flex-col items-center md:items-start justify-between">
                <div>
                    <span className="block text-sm font-bold text-foreground">{match.date}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">{match.venue}</span>
                </div>
                {/* Mobile Result Badge shows here */}
                <div className={`md:hidden px-2 py-0.5 rounded text-[10px] font-bold uppercase ${resultBadgeBg} ${resultColor}`}>
                    {match.result === 'won' ? 'W' : match.result === 'lost' ? 'L' : 'D'}
                </div>
            </div>

            {/* Col 2: The Matchup & Scores (Width: 5/12) */}
            <div className="md:col-span-5 flex items-center justify-between md:justify-start md:gap-8">
                
                {/* My Team */}
                <div className="flex flex-col md:flex-row items-center gap-3 min-w-[100px]">
                    <span className="text-lg hidden md:block">{match.myTeam.logo}</span>
                    <div className="flex flex-col md:items-start items-center">
                        <span className={`text-sm font-bold ${isWin ? 'text-primary' : 'text-foreground'}`}>
                            {match.myTeam.score}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{match.myTeam.short} (You)</span>
                    </div>
                </div>

                {/* Divider / VS */}
                <div className="flex flex-col items-center px-2">
                    <span className="text-[10px] font-bold text-muted-foreground/40">VS</span>
                </div>

                {/* Opponent */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-3 min-w-[100px] text-right">
                    <span className="text-lg hidden md:block">{match.opponent.logo}</span>
                    <div className="flex flex-col md:items-end items-center">
                        <span className={`text-sm font-bold ${isLoss ? 'text-primary' : 'text-foreground'}`}>
                            {match.opponent.score}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{match.opponent.short}</span>
                    </div>
                </div>
            </div>

            {/* Col 3: Result & Context (Width: 3/12) */}
            <div className="hidden md:flex md:col-span-3 flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${resultColor}`}>
                        {match.margin}
                    </span>
                    <div className={`h-2 w-2 rounded-full ${isWin ? 'bg-green-500' : isLoss ? 'bg-destructive' : 'bg-orange-500'}`} />
                </div>
                {match.mom && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                        <Trophy size={10} className="text-yellow-500" /> {match.mom}
                    </span>
                )}
            </div>

            {/* Col 4: Action (Width: 1/12) */}
            <div className="hidden md:flex md:col-span-1 justify-end">
                <button className="p-2 rounded-full text-muted-foreground hover:bg-background hover:text-primary transition-colors border border-transparent hover:border-border hover:shadow-sm">
                    <Eye size={16} />
                </button>
            </div>
        </div>
    );
};

const MyMatchesPage = () => {
    const [search, setSearch] = useState('');

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <Navbar />
            
            <main className="w-full px-4 py-8 md:px-8 lg:px-12 mx-auto">
                
                {/* Page Header */}
                <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Match Center</h1>
                        <p className="mt-1 text-muted-foreground">Manage schedule and match reports.</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Search opponents, venues..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm outline-none focus:ring-1 focus:ring-ring transition-all"
                        />
                    </div>
                </div>

                {/* 1. UPCOMING SECTION */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="flex items-center gap-2 text-lg font-bold">
                            <Clock size={18} className="text-primary" /> Upcoming Fixtures
                        </h2>
                        <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded-full border border-border hover:bg-secondary text-muted-foreground transition-colors">
                                <ArrowRight size={14} className="rotate-180" />
                            </button>
                            <button className="p-1.5 rounded-full border border-border hover:bg-secondary text-muted-foreground transition-colors">
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0 scrollbar-hide">
                        {UPCOMING_MATCHES.map(match => (
                            <FixtureCard key={match.id} match={match} />
                        ))}
                        <div className="flex min-w-[150px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground hover:bg-muted/30 hover:text-foreground cursor-pointer transition-colors group">
                            <div className="rounded-full bg-background p-3 shadow-sm group-hover:scale-110 transition-transform">
                                <Calendar size={20} />
                            </div>
                            <span className="text-sm font-medium">Full Schedule</span>
                        </div>
                    </div>
                </section>

                {/* 2. HISTORY SECTION (New List Design) */}
                <section className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    
                    {/* Header Bar */}
                    <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-4 md:px-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Trophy size={18} className="text-primary" /> Past Results
                            </h2>
                            <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground">
                                Season 2025
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-background transition-colors">
                                <Download size={12} /> Export CSV
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition-colors">
                                <Filter size={12} /> Filter
                            </button>
                        </div>
                    </div>

                    {/* Column Headers (Desktop Only) */}
                    <div className="hidden md:grid grid-cols-12 gap-4 border-b border-border bg-background px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        <div className="col-span-3">Date & Venue</div>
                        <div className="col-span-5">Scorecard</div>
                        <div className="col-span-3 text-right">Result</div>
                        <div className="col-span-1 text-right">Details</div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-border">
                        {HISTORY_MATCHES.map(match => (
                            <MatchResultRow key={match.id} match={match} />
                        ))}
                    </div>

                    {/* Footer / Pagination */}
                    <div className="border-t border-border bg-muted/10 p-3 text-center">
                        <button className="text-xs font-medium text-primary hover:underline">
                            Load previous matches
                        </button>
                    </div>

                </section>

            </main>
        </div>
    );
};

export default MyMatchesPage;