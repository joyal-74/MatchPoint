import { Trophy, Play, MessageCircle, ArrowRight } from 'lucide-react';
import Navbar from '../../components/player/Navbar';
import Footer from '../../components/viewer/Footer';
import image from '../../assets/images/cricket-4.png'
import TournamentsCard from '../../components/player/TournamentsCard';

export const PlayerDashboard: React.FC = () => {
    const features = [
        {
            icon: Trophy,
            title: 'Join Cricket Tournaments',
            description: 'Discover and participate in cricket tournaments across all formats - T20, ODI, and Test matches. Filter by skill level, location, and prize pool.',
            gradient: 'from-emerald-400 to-emerald-600'
        },
        {
            icon: Play,
            title: 'Watch Live Cricket',
            description: 'Stream live cricket matches in HD with ball-by-ball commentary, live scores, and interactive features.',
            gradient: 'from-red-400 to-red-600'
        },
        {
            icon: MessageCircle,
            title: 'Team Communication',
            description: 'Stay connected with your cricket team, discuss strategies, share match highlights, and celebrate victories together.',
            gradient: 'from-pink-400 to-pink-600'
        }
    ];

    const liveMatches = [
        {
            tournament: 'Premier Cricket Championship',
            teams: { team1: 'Mumbai Warriors', team2: 'Delhi Capitals' },
            score: { team1: '156/4', team2: '78/2' },
            overs: { team1: '20', team2: '12.3' },
            status: 'Live',
            viewers: '12.5K',
            format: 'T20'
        },
        {
            tournament: 'State Cricket League',
            teams: { team1: 'Chennai Kings', team2: 'Bangalore Tigers' },
            score: { team1: '289', team2: '245/6' },
            overs: { team1: '50', team2: '43.2' },
            status: 'Live',
            viewers: '8.2K',
            format: 'ODI'
        },
        {
            tournament: 'Local Cricket Cup',
            teams: { team1: 'Rajasthan Lions', team2: 'Punjab Hawks' },
            score: { team1: '167/8', team2: '89/3' },
            overs: { team1: '20', team2: '14.4' },
            status: 'Live',
            viewers: '5.7K',
            format: 'T20'
        },
        {
            tournament: 'University Cricket Series',
            teams: { team1: 'IIT Delhi', team2: 'NIT Mumbai' },
            score: { team1: '234/9', team2: '156/4' },
            overs: { team1: '50', team2: '31.5' },
            status: 'Live',
            viewers: '3.1K',
            format: 'ODI'
        }
    ];

    const upcomingTournaments = [
        {
            name: 'City Cricket Championship',
            format: 'T20',
            startDate: 'Jan 15, 2024',
            prize: '₹50,000',
            teams: 16,
            location: 'Mumbai'
        },
        {
            title: 'Corporate Cricket League',
            format: 'ODI',
            startDate: 'Jan 22, 2024',
            prizePool: '₹1,00,000',
            teams: 12,
            location: 'Bangalore'
        },
        {
            name: 'Weekend Warriors Cup',
            format: 'T20',
            startDate: 'Feb 5, 2024',
            prize: '₹25,000',
            teams: 8,
            location: 'Delhi'
        }
    ];

    const playerStats = [
        { number: '23', label: 'Tournaments Joined' },
        { number: '147', label: 'Matches Played' },
        { number: '2,450', label: 'Runs Scored' },
        { number: '18', label: 'Wickets Taken' }
    ];

    return (
        <div className="min-h-screen">
            <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-0 transition-colors duration-300">

                <Navbar />

                <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-16 lg:px-16">
                    {/* Background Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-neutral-900/5" />

                    {/* Content Container */}
                    <div className="relative z-10 w-full mx-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">

                            {/* Left Content */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                                        <span className="bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
                                            Ready for Your
                                        </span>
                                        <br />
                                        <span className="bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                                            Sports Challenge?
                                        </span>
                                    </h1>

                                    <div className="space-y-4">
                                        <p className="text-xl font-semibold text-neutral-700 dark:text-neutral-200 text-left leading-relaxed">
                                            Discover upcoming sports tournaments, join your teammates in live matches
                                        </p>

                                        <p className="text-lg text-neutral-400 text-left leading-relaxed">
                                            Join the ultimate sports experience. Track matches, follow players,
                                            and immerse yourself in the world of competitive sports.
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-emerald-500/25">
                                        <Trophy />
                                        <span>Browse Tournaments</span>
                                    </button>
                                    <button className="border-2 border-neutral-300 dark:border-neutral-600 hover:border-emerald-500 dark:hover:border-emerald-400 text-neutral-700 dark:text-neutral-200 hover:text-emerald-600 dark:hover:text-emerald-400 px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2">
                                        <Play />
                                        <span>Watch Live</span>
                                    </button>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 pt-8 border-t border-neutral-200 dark:border-neutral-700">
                                    {playerStats.map((stat, index) => (
                                        <div key={index} className="text-center p-4">
                                            <div className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">
                                                {stat.number}
                                            </div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative flex justify-end">

                                <div className="w-75 h-75 lg:w-80 lg:h-96 bg-green-400/20 rounded-2xl transform right-10 rotate-15 bottom-4 top-4 absolute" />

                                <img
                                    src={image}
                                    alt="Sports character"
                                    className="relative z-10 max-h-[420px] object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 right-20 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                </section>


                {/* Features Section */}
                <section id="features" className="py-16 bg-[var(--color-background)]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4 py-2 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-0 dark:to-neutral-300 bg-clip-text text-transparent">
                                Everything You Need for Sports
                            </h2>
                            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
                                From tournament participation to live streaming and team coordination - your complete sports companion.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-3 text-neutral-800 dark:text-neutral-200">
                                        {feature.title}
                                    </h3>
                                    <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Live Matches Section */}
                <section id="live-matches" className="py-16 bg-[var(--color-background)] dark:bg-neutral-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                                    Live Cricket Matches
                                </h2>
                                <p className="text-neutral-600 dark:text-neutral-300">
                                    Watch ongoing matches and follow live scores
                                </p>
                            </div>
                            <button className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-2 hover:space-x-3 transition-all duration-200">
                                <span>View All</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {liveMatches.map((match, index) => (
                                <div
                                    key={index}
                                    className="bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                                <span className="text-red-500 font-semibold text-sm">LIVE</span>
                                                <span className="text-neutral-500 dark:text-neutral-400 text-sm">•</span>
                                                <span className="text-neutral-500 dark:text-neutral-400 text-sm">{match.viewers} watching</span>
                                            </div>
                                            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded text-sm font-medium">
                                                {match.format}
                                            </span>
                                        </div>

                                        <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                                            {match.tournament}
                                        </h3>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                                    {match.teams.team1}
                                                </span>
                                                <div className="text-right">
                                                    <span className="font-bold text-lg text-neutral-800 dark:text-neutral-200">
                                                        {match.score.team1}
                                                    </span>
                                                    <span className="text-neutral-500 dark:text-neutral-400 text-sm ml-2">
                                                        ({match.overs.team1})
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                                    {match.teams.team2}
                                                </span>
                                                <div className="text-right">
                                                    <span className="font-bold text-lg text-neutral-800 dark:text-neutral-200">
                                                        {match.score.team2}
                                                    </span>
                                                    <span className="text-neutral-500 dark:text-neutral-400 text-sm ml-2">
                                                        ({match.overs.team2})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2">
                                            <Play className="w-4 h-4" />
                                            <span>Watch Live</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <TournamentsCard upcomingTournaments={upcomingTournaments}/>

                {/* Footer */}
                <Footer />
            </div >
        </div >
    );
}

export default PlayerDashboard;