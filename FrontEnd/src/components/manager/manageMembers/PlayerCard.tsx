import React from 'react';
import { CheckCircle2, Eye, ArrowRightLeft, Plus, Shield, User } from 'lucide-react';
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
    maxPlayingReached = false,
}) => {
    
    // 1. Determine Interaction Logic
    const handleCardClick = (e: React.MouseEvent) => {
        // Prevent triggering swap when clicking buttons
        if ((e.target as HTMLElement).closest('button')) return;

        if (swapMode && !isSelected) {
            onAction('swap', player);
        }
    };

    // 2. Configuration based on Card Type (Active vs Bench)
    const isPlaying = cardStyle === 'playing';
    
    const theme = isPlaying ? {
        border: 'border-green-500/20',
        hoverBorder: 'group-hover:border-green-500/50',
        iconBg: 'bg-green-500/10',
        iconColor: 'text-green-600 dark:text-green-400',
        accent: 'bg-green-500',
        muted: 'text-green-600/60 dark:text-green-400/60'
    } : {
        border: 'border-orange-500/20',
        hoverBorder: 'group-hover:border-orange-500/50',
        iconBg: 'bg-orange-500/10',
        iconColor: 'text-orange-600 dark:text-orange-400',
        accent: 'bg-orange-500',
        muted: 'text-orange-600/60 dark:text-orange-400/60'
    };

    // 3. Dynamic Card Classes
    const getCardClasses = () => {
        const base = "relative group rounded-xl border p-4 transition-all duration-200 flex flex-col gap-3 overflow-hidden bg-card";
        
        if (isSelected) {
            return `${base} border-primary bg-primary/5 ring-1 ring-primary shadow-md transform scale-[1.02] z-10`;
        }
        
        if (swapMode) {
            return `${base} ${theme.border} border-dashed cursor-pointer hover:bg-accent/50 hover:border-primary/50 hover:shadow-md`;
        }

        return `${base} ${theme.border} hover:shadow-sm ${theme.hoverBorder}`;
    };

    // 4. Action Button Logic
    const getActionConfig = () => {
        if (isPlaying) return { label: 'Bench', icon: ArrowRightLeft, action: 'makeSubstitute' as const, disabled: false };
        if (maxPlayingReached) return { label: 'Swap', icon: ArrowRightLeft, action: 'swap' as const, disabled: false };
        return { label: 'Add', icon: Plus, action: 'makeActive' as const, disabled: false };
    };

    const actionConfig = getActionConfig();
    const ActionIcon = actionConfig.icon;

    return (
        <div className={getCardClasses()} onClick={swapMode ? handleCardClick : undefined}>
            
            {/* Visual Indicator Bar (Left Side) */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isSelected ? 'bg-primary' : theme.accent} opacity-40`} />

            {/* Selection Checkmark Overlay */}
            {isSelected && (
                <div className="absolute top-2 right-2 text-primary animate-in zoom-in">
                    <CheckCircle2 size={20} fill="currentColor" className="text-background" />
                </div>
            )}

            {/* Top Section: Avatar & Info */}
            <div className="flex items-start gap-3 pl-2">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
                        {player.profileImage ? (
                            <img src={player.profileImage} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs font-bold text-muted-foreground">
                                {player.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    {/* Role Icon Badge */}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${theme.iconBg} border border-background flex items-center justify-center`}>
                        {isPlaying ? <Shield size={10} className={theme.iconColor} /> : <User size={10} className={theme.iconColor} />}
                    </div>
                </div>

                {/* Text Details */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate pr-4">
                        {player.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                        {player.position || 'Player'}
                    </p>
                    
                    {/* Status Badge */}
                    <div className="mt-1 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${theme.accent}`}></span>
                        <span className={`text-[10px] font-medium uppercase tracking-wide ${theme.muted}`}>
                            {cardStyle}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Actions */}
            <div className="flex gap-2 pl-2 mt-auto pt-2 border-t border-border/50">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (swapMode && isSelected) cancelSwap();
                        else onAction(actionConfig.action, player);
                    }}
                    disabled={actionConfig.disabled}
                    className={`
                        flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors
                        ${actionConfig.disabled 
                            ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                            : 'bg-primary/10 text-primary hover:bg-primary/20'
                        }
                    `}
                >
                    <ActionIcon size={14} />
                    {actionConfig.label}
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAction('view', player);
                    }}
                    className="
                        px-2 py-1.5 rounded-md text-muted-foreground bg-muted/50 
                        hover:bg-muted hover:text-foreground transition-colors
                    "
                    title="View Details"
                >
                    <Eye size={14} />
                </button>
            </div>
        </div>
    );
};

export default PlayerCard;