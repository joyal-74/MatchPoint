export interface ColorScheme {
    bg: string; 
    border: string;
    hoverBorder: string;
    text: string;
    hoverText: string;
    buttonBg: string;
    buttonHoverBg: string;
    buttonBorder: string;
    buttonHoverBorder: string;
    accent: string;       
    glow: string;         
    cardGradient: string; 
    cardBorder: string;   
}

export const colorPalette: ColorScheme[] = [
    {
        bg: 'bg-blue-500',
        border: 'border-blue-200 dark:border-blue-800',
        hoverBorder: 'group-hover:border-blue-500/50',
        accent: 'bg-blue-500',
        glow: 'shadow-blue-500/10',
        text: 'text-blue-600 dark:text-blue-400',
        hoverText: 'group-hover:text-blue-500',
        buttonBg: 'bg-blue-50 dark:bg-blue-500/10',
        buttonHoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-500/20',
        buttonBorder: 'border-blue-200 dark:border-blue-500/20',
        buttonHoverBorder: 'hover:border-blue-300 dark:hover:border-blue-500/50',
        cardGradient: 'from-blue-50 to-white dark:from-blue-950/20 dark:to-neutral-900',
        cardBorder: 'border-blue-100 dark:border-blue-900'
    },
    {
        bg: 'bg-emerald-500',
        border: 'border-emerald-200 dark:border-emerald-800',
        hoverBorder: 'group-hover:border-emerald-500/50',
        accent: 'bg-emerald-500',
        glow: 'shadow-emerald-500/10',
        text: 'text-emerald-600 dark:text-emerald-400',
        hoverText: 'group-hover:text-emerald-500',
        buttonBg: 'bg-emerald-50 dark:bg-emerald-500/10',
        buttonHoverBg: 'hover:bg-emerald-100 dark:hover:bg-emerald-500/20',
        buttonBorder: 'border-emerald-200 dark:border-emerald-500/20',
        buttonHoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-500/50',
        cardGradient: 'from-emerald-50 to-white dark:from-emerald-950/20 dark:to-neutral-900',
        cardBorder: 'border-emerald-100 dark:border-emerald-900'
    },
    {
        bg: 'bg-purple-500',
        border: 'border-purple-200 dark:border-purple-800',
        hoverBorder: 'group-hover:border-purple-500/50',
        accent: 'bg-purple-500',
        glow: 'shadow-purple-500/10',
        text: 'text-purple-600 dark:text-purple-400',
        hoverText: 'group-hover:text-purple-500',
        buttonBg: 'bg-purple-50 dark:bg-purple-500/10',
        buttonHoverBg: 'hover:bg-purple-100 dark:hover:bg-purple-500/20',
        buttonBorder: 'border-purple-200 dark:border-purple-500/20',
        buttonHoverBorder: 'hover:border-purple-300 dark:hover:border-purple-500/50',
        cardGradient: 'from-purple-50 to-white dark:from-purple-950/20 dark:to-neutral-900',
        cardBorder: 'border-purple-100 dark:border-purple-900'
    },
    {
        bg: 'bg-pink-500',
        border: 'border-pink-200 dark:border-pink-800',
        hoverBorder: 'group-hover:border-pink-500/50',
        accent: 'bg-pink-500',
        glow: 'shadow-pink-500/10',
        text: 'text-pink-600 dark:text-pink-400',
        hoverText: 'group-hover:text-pink-500',
        buttonBg: 'bg-pink-50 dark:bg-pink-500/10',
        buttonHoverBg: 'hover:bg-pink-100 dark:hover:bg-pink-500/20',
        buttonBorder: 'border-pink-200 dark:border-pink-500/20',
        buttonHoverBorder: 'hover:border-pink-300 dark:hover:border-pink-500/50',
        cardGradient: 'from-pink-50 to-white dark:from-pink-950/20 dark:to-neutral-900',
        cardBorder: 'border-pink-100 dark:border-pink-900'
    },
    {
        bg: 'bg-orange-500',
        border: 'border-orange-200 dark:border-orange-800',
        hoverBorder: 'group-hover:border-orange-500/50',
        accent: 'bg-orange-500',
        glow: 'shadow-orange-500/10',
        text: 'text-orange-600 dark:text-orange-400',
        hoverText: 'group-hover:text-orange-500',
        buttonBg: 'bg-orange-50 dark:bg-orange-500/10',
        buttonHoverBg: 'hover:bg-orange-100 dark:hover:bg-orange-500/20',
        buttonBorder: 'border-orange-200 dark:border-orange-500/20',
        buttonHoverBorder: 'hover:border-orange-300 dark:hover:border-orange-500/50',
        cardGradient: 'from-orange-50 to-white dark:from-orange-950/20 dark:to-neutral-900',
        cardBorder: 'border-orange-100 dark:border-orange-900'
    },
    {
        bg: 'bg-cyan-500',
        border: 'border-cyan-200 dark:border-cyan-800',
        hoverBorder: 'group-hover:border-cyan-500/50',
        accent: 'bg-cyan-500',
        glow: 'shadow-cyan-500/10',
        text: 'text-cyan-600 dark:text-cyan-400',
        hoverText: 'group-hover:text-cyan-500',
        buttonBg: 'bg-cyan-50 dark:bg-cyan-500/10',
        buttonHoverBg: 'hover:bg-cyan-100 dark:hover:bg-cyan-500/20',
        buttonBorder: 'border-cyan-200 dark:border-cyan-500/20',
        buttonHoverBorder: 'hover:border-cyan-300 dark:hover:border-cyan-500/50',
        cardGradient: 'from-cyan-50 to-white dark:from-cyan-950/20 dark:to-neutral-900',
        cardBorder: 'border-cyan-100 dark:border-cyan-900'
    },
    {
        bg: 'bg-amber-500',
        border: 'border-amber-200 dark:border-amber-800',
        hoverBorder: 'group-hover:border-amber-500/50',
        accent: 'bg-amber-500',
        glow: 'shadow-amber-500/10',
        text: 'text-amber-600 dark:text-amber-400',
        hoverText: 'group-hover:text-amber-500',
        buttonBg: 'bg-amber-50 dark:bg-amber-500/10',
        buttonHoverBg: 'hover:bg-amber-100 dark:hover:bg-amber-500/20',
        buttonBorder: 'border-amber-200 dark:border-amber-500/20',
        buttonHoverBorder: 'hover:border-amber-300 dark:hover:border-amber-500/50',
        cardGradient: 'from-amber-50 to-white dark:from-amber-950/20 dark:to-neutral-900',
        cardBorder: 'border-amber-100 dark:border-amber-900'
    },
    {
        bg: 'bg-violet-500',
        border: 'border-violet-200 dark:border-violet-800',
        hoverBorder: 'group-hover:border-violet-500/50',
        accent: 'bg-violet-500',
        glow: 'shadow-violet-500/10',
        text: 'text-violet-600 dark:text-violet-400',
        hoverText: 'group-hover:text-violet-500',
        buttonBg: 'bg-violet-50 dark:bg-violet-500/10',
        buttonHoverBg: 'hover:bg-violet-100 dark:hover:bg-violet-500/20',
        buttonBorder: 'border-violet-200 dark:border-violet-500/20',
        buttonHoverBorder: 'hover:border-violet-300 dark:hover:border-violet-500/50',
        cardGradient: 'from-violet-50 to-white dark:from-violet-950/20 dark:to-neutral-900',
        cardBorder: 'border-violet-100 dark:border-violet-900'
    },
    {
        bg: 'bg-rose-500',
        border: 'border-rose-200 dark:border-rose-800',
        hoverBorder: 'group-hover:border-rose-500/50',
        accent: 'bg-rose-500',
        glow: 'shadow-rose-500/10',
        text: 'text-rose-600 dark:text-rose-400',
        hoverText: 'group-hover:text-rose-500',
        buttonBg: 'bg-rose-50 dark:bg-rose-500/10',
        buttonHoverBg: 'hover:bg-rose-100 dark:hover:bg-rose-500/20',
        buttonBorder: 'border-rose-200 dark:border-rose-500/20',
        buttonHoverBorder: 'hover:border-rose-300 dark:hover:border-rose-500/50',
        cardGradient: 'from-rose-50 to-white dark:from-rose-950/20 dark:to-neutral-900',
        cardBorder: 'border-rose-100 dark:border-rose-900'
    }
];

export const length = colorPalette.length - 1

export const getColorScheme = (index: number): ColorScheme => {
    return colorPalette[index % colorPalette.length];
};

export const completedColorScheme: ColorScheme = {
    bg: 'bg-muted-foreground',
    border: 'border-border',
    hoverBorder: 'group-hover:border-muted-foreground/50',
    accent: 'bg-muted-foreground',
    glow: 'shadow-none',
    text: 'text-muted-foreground',
    hoverText: 'group-hover:text-foreground',
    buttonBg: 'bg-muted',
    buttonHoverBg: 'hover:bg-muted/80',
    buttonBorder: 'border-border',
    buttonHoverBorder: 'hover:border-muted-foreground',
    cardGradient: 'from-muted/5 to-transparent',
    cardBorder: 'border-border'
};