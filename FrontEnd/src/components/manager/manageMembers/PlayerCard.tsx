import React from 'react';
import { CheckCircle2, Eye, ArrowRightLeft, Plus } from 'lucide-react';
import type { TeamPlayer } from '../../../types/Player';

interface PlayerCardProps {
    player: TeamPlayer;
    cardStyle: 'playing' | 'substitution';
    onAction: (action: 'swap' | 'makeSubstitute' | 'makeActive' | 'view', player: TeamPlayer) => void;
    isSelected: boolean;
    swapMode: boolean;
    cancelSwap: () => void;
    compact?: boolean;
    maxPlayingReached?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
    player,
    onAction,
    isSelected,
    swapMode,
    cardStyle,
    cancelSwap,
    compact = false,
    maxPlayingReached = false,
}) => {
    const handleCardClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;

        // if clicking on a button or inside one → do nothing
        if (target.closest('button')) return;

        if (swapMode && !isSelected) {
            onAction('swap', player);
        }
    };


    const getCardStyle = () => {
        const baseClasses = 'rounded-lg border transition-all duration-300';

        if (isSelected) {
            return {
                playing: `${baseClasses} border-green-400 bg-gradient-to-br from-green-500/20 to-green-600/10 shadow-lg shadow-green-500/30`,
                substitution: `${baseClasses} border-blue-400 bg-gradient-to-br from-blue-500/20 to-blue-600/10 shadow-lg shadow-blue-500/30`,
            };
        }

        if (swapMode) {
            return {
                playing: `${baseClasses} cursor-pointer border-amber-400/50 bg-gradient-to-br from-amber-500/10 to-orange-500/5 hover:border-amber-400 hover:from-amber-500/20 hover:to-orange-500/10 hover:shadow-lg hover:shadow-amber-500/20`,
                substitution: `${baseClasses} cursor-pointer border-purple-400/50 bg-gradient-to-br from-purple-500/10 to-pink-500/5 hover:border-purple-400 hover:from-purple-500/20 hover:to-pink-500/10 hover:shadow-lg hover:shadow-purple-500/20`,
            };
        }

        return {
            playing: `${baseClasses} border-green-700 bg-gradient-to-br from-green-900/30 to-green-950/20 hover:border-green-600 hover:from-green-900/40 hover:to-green-950/30`,
            substitution: `${baseClasses} border-neutral-600 bg-gradient-to-br from-neutral-800/50 to-neutral-900/30 hover:border-neutral-500 hover:from-neutral-800/60 hover:to-neutral-900/40`,
        };
    };

    const styles = getCardStyle();
    const cardClass = styles[cardStyle];

    const getStatusColor = (status: string) => {
        const colors = {
            active: 'bg-green-500/20 border-green-500/30 text-green-300',
            substitute: 'bg-neutral-500/20 border-neutral-500/30 text-neutral-300',
        };
        return colors[status as keyof typeof colors] || colors.substitute;
    };

    // Determine button behavior based on player type and max playing reached
    const getActionButtonConfig = () => {
        if (cardStyle === 'playing') {
            // Playing players always use swap
            return {
                label: 'Swap',
                icon: ArrowRightLeft,
                action: 'swap' as const,
                disabled: false
            };
        } else {
            if (maxPlayingReached) {
                return {
                    label: 'Swap',
                    icon: ArrowRightLeft,
                    action: 'swap' as const,
                    disabled: false
                };
            } else {
                return {
                    label: 'Add',
                    icon: Plus,
                    action: 'makeActive' as const,
                    disabled: false
                };
            }
        }
    };

    const actionConfig = getActionButtonConfig();
    const ActionIcon = actionConfig.icon;

    const cardPadding = compact ? 'p-3' : 'p-4';

    return (
        <div
            className={`${cardClass} ${cardPadding} ${swapMode ? 'cursor-pointer' : ''}`}
            onClick={swapMode ? handleCardClick : undefined}
        >

            {/* Header: Player Info */}
            <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-white/20 overflow-hidden">
                            {player.profileImage ? (
                                <img src={player.profileImage} alt={player.name} className="w-full h-full object-cover" />
                            ) : (
                                player.name.charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-white truncate">{player.name}</h3>
                        <div className='flex justify-between items-baseline'>
                            <p className="text-neutral-400 text-xs truncate">{player.position}</p>
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(player.status)}`}>
                                <span className="capitalize">{player.status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {isSelected && (
                    <div className="flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
                <button
                    onClick={(e) => {
                        e.stopPropagation();

                        if (swapMode && isSelected) {
                            cancelSwap();
                        } else {
                            onAction(actionConfig.action, player);
                        }
                    }}
                    disabled={actionConfig.disabled}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border backdrop-blur-sm ${actionConfig.disabled
                        ? 'bg-neutral-500/20 border-neutral-500/40 text-neutral-400 cursor-not-allowed'
                        : cardStyle === 'playing'
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30 hover:border-amber-500/60'
                            : 'bg-purple-500/20 border-purple-500/40 text-purple-300 hover:bg-purple-500/30 hover:border-purple-500/60'
                        }`}
                >
                    <ActionIcon className="w-3 h-3" />
                    <span>{actionConfig.label}</span>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAction('view', player);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border backdrop-blur-sm bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40"
                >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                </button>
            </div>
        </div>
    );
};

export default PlayerCard;