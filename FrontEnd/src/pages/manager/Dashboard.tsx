import Navbar from "../../components/manager/Navbar";
import image from '../../assets/images/cricket-3.png'

import { Users, Calendar, BarChart3, ArrowRight } from 'lucide-react';
import Footer from "../../components/viewer/Footer";

export default function ManagerDashboard() {
    const features = [
        {
            icon: Users,
            title: 'Team Management',
            description: 'Manage your cricket teams, track player performance, handle registrations, and organize squad rotations efficiently.',
            gradient: 'from-blue-400 to-blue-600'
        },
        {
            icon: Calendar,
            title: 'Schedule & Fixtures',
            description: 'Create match schedules, manage tournament fixtures, send notifications, and handle venue bookings seamlessly.',
            gradient: 'from-purple-400 to-purple-600'
        },
        {
            icon: BarChart3,
            title: 'Analytics & Reports',
            description: 'Access detailed statistics, generate performance reports, track team progress, and make data-driven decisions.',
            gradient: 'from-orange-400 to-orange-600'
        }
    ];

    const activeTournaments = [
        {
            name: 'City Cricket Championship',
            format: 'T20',
            status: 'Ongoing',
            teams: 16,
            matchesCompleted: 24,
            totalMatches: 32,
            progress: 75,
            upcomingMatch: 'Semi Final 1 - Tomorrow 2:00 PM'
        },
        {
            name: 'Corporate Cricket League',
            format: 'ODI',
            status: 'Ongoing',
            teams: 12,
            matchesCompleted: 18,
            totalMatches: 28,
            progress: 64,
            upcomingMatch: 'Quarter Final 3 - Today 6:00 PM'
        },
        {
            name: 'Weekend Warriors Cup',
            format: 'T20',
            status: 'Registration',
            teams: 8,
            matchesCompleted: 0,
            totalMatches: 14,
            progress: 0,
            upcomingMatch: 'Starts Feb 5, 2024'
        }
    ];

    const managerStats = [
        { number: '12', label: 'Active Tournaments' },
        { number: '156', label: 'Registered Teams' },
        { number: '1,847', label: 'Total Players' },
        { number: '234', label: 'Matches Scheduled' }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">

                <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-16 lg:px-16">
                    {/* Background Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />

                    {/* Content Container */}
                    <div className="relative z-10 w-full max-w-8xl p-3 mx-auto ">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                                        <span className="bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
                                            Manage Your
                                        </span>
                                        <br />
                                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                            Sports Empire
                                        </span>
                                    </h1>

                                    <div className="space-y-4">
                                        <p className="text-xl font-semibold text-neutral-700 dark:text-neutral-200 leading-relaxed">
                                            Streamline tournament operations, manage teams, and make data-driven decisions
                                        </p>

                                        <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                            Complete tournament management solution for organizing sports competitions,
                                            tracking performance, and ensuring smooth operations.
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25">
                                        <Calendar className="w-5 h-5" />
                                        <span>Create Tournament</span>
                                    </button>
                                    <button className="border-2 border-neutral-300 dark:border-neutral-600 hover:border-blue-500 dark:hover:border-blue-400 text-neutral-700 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400 px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2">
                                        <BarChart3 className="w-5 h-5" />
                                        <span>View Analytics</span>
                                    </button>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 pt-8 border-t border-neutral-200 dark:border-neutral-700">
                                    {managerStats.map((stat, index) => (
                                        <div key={index} className="text-center p-4">
                                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {stat.number}
                                            </div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Content - Dashboard Preview */}
                            <div className="relative flex justify-end">
                                <div className="w-75 h-75 lg:w-80 lg:h-96 bg-purple-500/10 rounded-2xl transform right-10 rotate-15 bottom-4 top-4 absolute" />

                                <img
                                    src={image}
                                    alt="Sports character"
                                    className="relative z-10 max-h-[420px] object-contain"
                                />

                                {/* Decorative background element */}
                                <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-white dark:bg-neutral-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4 pb-1 bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-100 dark:to-neutral-300 bg-clip-text text-transparent">
                                Powerful Management Tools
                            </h2>
                            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                                Everything you need to organize and manage professional cricket tournaments efficiently.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-200"
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-4`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-3 text-neutral-800 dark:text-neutral-200">
                                        {feature.title}
                                    </h3>
                                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Active Tournaments Section */}
                <section className="py-16 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                                    Active Tournaments
                                </h2>
                                <p className="text-neutral-600 dark:text-neutral-400">
                                    Monitor and manage ongoing competitions
                                </p>
                            </div>
                            <button className="text-blue-600 dark:text-blue-400 font-semibold flex items-center space-x-2 hover:space-x-3 transition-all duration-200">
                                <span>View All</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {activeTournaments.map((tournament, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${tournament.status === 'Ongoing'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                }`}>
                                                {tournament.status}
                                            </span>
                                            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-sm font-medium">
                                                {tournament.format}
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-lg mb-3 text-neutral-800 dark:text-neutral-200">
                                            {tournament.name}
                                        </h3>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-neutral-600 dark:text-neutral-400">Teams</span>
                                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{tournament.teams}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-neutral-600 dark:text-neutral-400">Matches</span>
                                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {tournament.matchesCompleted}/{tournament.totalMatches}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between text-sm mb-1">
                                                    <span className="text-neutral-600 dark:text-neutral-400">Progress</span>
                                                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{tournament.progress}%</span>
                                                </div>
                                                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${tournament.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                            <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                                <Calendar className="w-4 h-4" />
                                                <span>{tournament.upcomingMatch}</span>
                                            </div>
                                            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200">
                                                Manage Tournament
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-white dark:bg-neutral-900">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Ready to Transform Your Tournament Management?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                Join thousands of managers who trust our platform for seamless cricket operations.

                            </span>
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-colors duration-200 shadow-lg">
                                Start Free Trial
                            </button>
                            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200">
                                Schedule Demo
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </>
    );
}