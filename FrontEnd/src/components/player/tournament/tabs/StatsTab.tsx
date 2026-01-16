import { TrendingUp, CircleDot, Medal, Star, Trophy } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useTournamentStats } from '../../../../hooks/player/useTournamentData';
import LoadingOverlay from '../../../shared/LoadingOverlay';

const StatsTab = () => {
    const { id } = useParams<{ id: string }>();
    const { stats, statsLoading, statsError } = useTournamentStats(id);

    if (statsError) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center text-muted-foreground">
                    <div className="text-sm">Error loading stats:</div>
                    <div className="text-xs mt-1">{statsError}</div>
                </div>
            </div>
        );
    }

    const hasStats = stats && (stats.orangeCap || stats.purpleCap || stats.mvp);

    return (
        <>
        <LoadingOverlay show={statsLoading}/>
            <div className="animate-in fade-in duration-300">
                {hasStats ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Orange Cap */}
                        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <TrendingUp className="w-24 h-24 text-orange-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider text-xs mb-4">
                                    <div className="p-1 bg-orange-500 rounded text-white">
                                        <Star className="w-3 h-3 fill-current" />
                                    </div>
                                    Orange Cap
                                </div>
                                <div className="w-20 h-20 rounded-full bg-orange-100 border-4 border-orange-500 mb-4 mx-auto flex items-center justify-center text-2xl font-bold text-orange-700">
                                    {stats.orangeCap?.player?.charAt(0) || 'O'}
                                </div>
                                <h3 className="text-xl font-bold text-center mb-1">{stats.orangeCap?.player || 'TBD'}</h3>
                                <p className="text-sm text-center text-muted-foreground mb-4">{stats.orangeCap?.team || ''}</p>
                                <div className="bg-background/50 rounded-xl p-3 text-center border border-orange-500/20">
                                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.orangeCap?.value || '0 Runs'}</div>
                                    <div className="text-xs text-muted-foreground">{stats.orangeCap?.subValue || ''}</div>
                                </div>
                            </div>
                        </div>

                        {/* Purple Cap */}
                        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <CircleDot className="w-24 h-24 text-purple-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider text-xs mb-4">
                                    <div className="p-1 bg-purple-500 rounded text-white">
                                        <Star className="w-3 h-3 fill-current" />
                                    </div>
                                    Purple Cap
                                </div>
                                <div className="w-20 h-20 rounded-full bg-purple-100 border-4 border-purple-500 mb-4 mx-auto flex items-center justify-center text-2xl font-bold text-purple-700">
                                    {stats.purpleCap?.player?.charAt(0) || 'P'}
                                </div>
                                <h3 className="text-xl font-bold text-center mb-1">{stats.purpleCap?.player || 'TBD'}</h3>
                                <p className="text-sm text-center text-muted-foreground mb-4">{stats.purpleCap?.team || ''}</p>
                                <div className="bg-background/50 rounded-xl p-3 text-center border border-purple-500/20">
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.purpleCap?.value || '0 Wkts'}</div>
                                    <div className="text-xs text-muted-foreground">{stats.purpleCap?.subValue || ''}</div>
                                </div>
                            </div>
                        </div>

                        {/* MVP */}
                        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Medal className="w-24 h-24 text-yellow-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-bold uppercase tracking-wider text-xs mb-4">
                                    <div className="p-1 bg-yellow-500 rounded text-white">
                                        <Trophy className="w-3 h-3 fill-current" />
                                    </div>
                                    MVP
                                </div>
                                <div className="w-20 h-20 rounded-full bg-yellow-100 border-4 border-yellow-500 mb-4 mx-auto flex items-center justify-center text-2xl font-bold text-yellow-700">
                                    {stats.mvp?.player?.charAt(0) || 'M'}
                                </div>
                                <h3 className="text-xl font-bold text-center mb-1">{stats.mvp?.player || 'TBD'}</h3>
                                <p className="text-sm text-center text-muted-foreground mb-4">{stats.mvp?.team || ''}</p>
                                <div className="bg-background/50 rounded-xl p-3 text-center border border-yellow-500/20">
                                    <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{stats.mvp?.value || 'All-Rounder'}</div>
                                    <div className="text-xs text-muted-foreground">{stats.mvp?.subValue || ''}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <div className="text-sm">No stats available yet</div>
                        <div className="text-xs mt-2 opacity-50">Stats will update as the tournament progresses</div>
                    </div>
                )}
            </div>
        </>
    );
};

export default StatsTab;