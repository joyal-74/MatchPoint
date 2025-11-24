import { TrendingUp, Trophy } from 'lucide-react'


const teamPerformance = [
        {
            team: 'Mumbai Warriors',
            played: 8,
            won: 6,
            lost: 2,
            points: 12,
            trend: 'up'
        },
        {
            team: 'Delhi Capitals',
            played: 8,
            won: 5,
            lost: 3,
            points: 10,
            trend: 'up'
        },
        {
            team: 'Chennai Kings',
            played: 8,
            won: 4,
            lost: 4,
            points: 8,
            trend: 'down'
        },
        {
            team: 'Bangalore Tigers',
            played: 8,
            won: 3,
            lost: 5,
            points: 6,
            trend: 'down'
        }
    ];

const PointsTable = () => {
    return (
        <div>
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                            Top Performers
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                            Current standings and trends
                        </p>
                    </div>
                    <Trophy className="w-6 h-6 text-yellow-500" />

                </div>

                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-100 dark:bg-neutral-700">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Team</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">P</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">W</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">L</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Pts</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                {teamPerformance.map((team, index) => (
                                    <tr key={index} className="hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                    {index + 1}
                                                </div>
                                                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                                    {team.team}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center text-neutral-700 dark:text-neutral-300">{team.played}</td>
                                        <td className="px-4 py-3 text-center text-green-600 dark:text-green-400 font-semibold">{team.won}</td>
                                        <td className="px-4 py-3 text-center text-red-600 dark:text-red-400 font-semibold">{team.lost}</td>
                                        <td className="px-4 py-3 text-center font-bold text-neutral-800 dark:text-neutral-200">{team.points}</td>
                                        <td className="px-4 py-3 text-center">
                                            <TrendingUp className={`w-4 h-4 mx-auto ${team.trend === 'up'
                                                ? 'text-green-600 dark:text-green-400'
                                                : 'text-red-600 dark:text-red-400 rotate-180'
                                                }`} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PointsTable