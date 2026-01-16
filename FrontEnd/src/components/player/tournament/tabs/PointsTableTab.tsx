import { useParams } from 'react-router-dom';
import { useTournamentPointsTable } from '../../../../hooks/player/useTournamentData';
import LoadingOverlay from '../../../shared/LoadingOverlay';

const PointsTableTab = () => {
    const { id } = useParams<{ id: string }>();
    const { pointsTable, pointsTableLoading, pointsTableError } = useTournamentPointsTable(id);

    if (pointsTableError) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center text-muted-foreground">
                    <div className="text-sm">Error loading points table:</div>
                    <div className="text-xs mt-1">{pointsTableError}</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <LoadingOverlay show={pointsTableLoading} />
            <div className="animate-in fade-in duration-300">
                {pointsTable.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <div className="text-sm">No points table available yet</div>
                        <div className="text-xs mt-2 opacity-50">Matches will update standings as they progress</div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-hidden rounded-xl border border-border bg-card">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-4">Team</th>
                                            <th className="px-4 py-4 text-center">P</th>
                                            <th className="px-4 py-4 text-center">W</th>
                                            <th className="px-4 py-4 text-center">L</th>
                                            <th className="px-4 py-4 text-center hidden md:table-cell">NRR</th>
                                            <th className="px-4 py-4 text-center">Pts</th>
                                            <th className="px-6 py-4 text-right hidden md:table-cell">Form</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {pointsTable.map((row) => (
                                            <tr key={row.rank} className={`hover:bg-muted/20 transition-colors ${row.rank <= 4 ? 'bg-primary/5' : ''}`}>
                                                <td className="px-6 py-4 font-medium flex items-center gap-3">
                                                    <span className={`w-6 text-center ${row.rank <= 4 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                                                        {row.rank}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                                                            {row.team.charAt(0)}
                                                        </div>
                                                        <span className="text-foreground">{row.team}</span>
                                                        {row.rank <= 4 && (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 ml-1" title="Qualifying Position" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center">{row.p}</td>
                                                <td className="px-4 py-4 text-center text-green-600 dark:text-green-400 font-medium">{row.w}</td>
                                                <td className="px-4 py-4 text-center text-red-600 dark:text-red-400">{row.l}</td>
                                                <td className="px-4 py-4 text-center font-mono text-xs hidden md:table-cell">{row.nrr}</td>
                                                <td className="px-4 py-4 text-center font-bold text-base">{row.pts}</td>
                                                <td className="px-6 py-4 text-right hidden md:table-cell">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {row.form.map((f, i) => (
                                                            <span
                                                                key={i}
                                                                className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white ${f === 'W' ? 'bg-green-500' : 'bg-red-500'
                                                                    }`}
                                                            >
                                                                {f}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>Top 4 teams qualify for semi-finals</span>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default PointsTableTab;