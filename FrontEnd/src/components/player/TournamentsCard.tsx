import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react'
import type { Tournament } from '../../features/manager/managerTypes'

interface TournamentsCardProps {
    upcomingTournaments: Tournament[];
}

const TournamentsCard = ({ upcomingTournaments }: TournamentsCardProps) => {
    return (
        <>
            <section id="tournaments" className="py-16 bg-[var(--color-background)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                                Upcoming Tournaments
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-300">
                                Register for upcoming cricket tournaments
                            </p>
                        </div>
                        <button className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-2">
                            <span>View All</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {upcomingTournaments.map((tournament, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full text-sm font-medium">
                                        {tournament.format}
                                    </span>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                            {tournament.prizePool}
                                        </div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                            Prize Pool
                                        </div>
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg mb-3 text-neutral-800 dark:text-neutral-200">
                                    {tournament.title}
                                </h3>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-300">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(tournament.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-300">
                                        <Users className="w-4 h-4" />
                                        <span>{tournament.teams?.length} Teams</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-300">
                                        <MapPin className="w-4 h-4" />
                                        <span>{tournament.location}</span>
                                    </div>
                                </div>

                                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold transition-colors duration-200">
                                    Register Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default TournamentsCard