
// teamColors.ts - Shared color palette
export interface ColorScheme {
    bg: string;
    border: string;
    hoverBorder: string;
    accent: string;
    glow: string;
    text: string;
    hoverText: string;
    buttonBg: string;
    buttonHoverBg: string;
    buttonBorder: string;
    buttonHoverBorder: string;
}

export const colorPalette: ColorScheme[] = [
    {
        bg: 'from-blue-500/10 to-blue-600/5',
        border: 'border-blue-500/30',
        hoverBorder: 'hover:border-blue-500/50',
        accent: 'bg-blue-500',
        glow: 'shadow-blue-500/10',
        text: 'text-blue-400',
        hoverText: 'hover:text-blue-300',
        buttonBg: 'bg-blue-500/10',
        buttonHoverBg: 'hover:bg-blue-500/20',
        buttonBorder: 'border-blue-500/30',
        buttonHoverBorder: 'hover:border-blue-500/50'
    },
    {
        bg: 'from-emerald-500/10 to-emerald-600/5',
        border: 'border-emerald-500/30',
        hoverBorder: 'hover:border-emerald-500/50',
        accent: 'bg-emerald-500',
        glow: 'shadow-emerald-500/10',
        text: 'text-emerald-400',
        hoverText: 'hover:text-emerald-300',
        buttonBg: 'bg-emerald-500/10',
        buttonHoverBg: 'hover:bg-emerald-500/20',
        buttonBorder: 'border-emerald-500/30',
        buttonHoverBorder: 'hover:border-emerald-500/50'
    },
    {
        bg: 'from-purple-500/10 to-purple-600/5',
        border: 'border-purple-500/30',
        hoverBorder: 'hover:border-purple-500/50',
        accent: 'bg-purple-500',
        glow: 'shadow-purple-500/10',
        text: 'text-purple-400',
        hoverText: 'hover:text-purple-300',
        buttonBg: 'bg-purple-500/10',
        buttonHoverBg: 'hover:bg-purple-500/20',
        buttonBorder: 'border-purple-500/30',
        buttonHoverBorder: 'hover:border-purple-500/50'
    },
    {
        bg: 'from-pink-500/10 to-pink-600/5',
        border: 'border-pink-500/30',
        hoverBorder: 'hover:border-pink-500/50',
        accent: 'bg-pink-500',
        glow: 'shadow-pink-500/10',
        text: 'text-pink-400',
        hoverText: 'hover:text-pink-300',
        buttonBg: 'bg-pink-500/10',
        buttonHoverBg: 'hover:bg-pink-500/20',
        buttonBorder: 'border-pink-500/30',
        buttonHoverBorder: 'hover:border-pink-500/50'
    },
    {
        bg: 'from-orange-500/10 to-orange-600/5',
        border: 'border-orange-500/30',
        hoverBorder: 'hover:border-orange-500/50',
        accent: 'bg-orange-500',
        glow: 'shadow-orange-500/10',
        text: 'text-orange-400',
        hoverText: 'hover:text-orange-300',
        buttonBg: 'bg-orange-500/10',
        buttonHoverBg: 'hover:bg-orange-500/20',
        buttonBorder: 'border-orange-500/30',
        buttonHoverBorder: 'hover:border-orange-500/50'
    },
    {
        bg: 'from-cyan-500/10 to-cyan-600/5',
        border: 'border-cyan-500/30',
        hoverBorder: 'hover:border-cyan-500/50',
        accent: 'bg-cyan-500',
        glow: 'shadow-cyan-500/10',
        text: 'text-cyan-400',
        hoverText: 'hover:text-cyan-300',
        buttonBg: 'bg-cyan-500/10',
        buttonHoverBg: 'hover:bg-cyan-500/20',
        buttonBorder: 'border-cyan-500/30',
        buttonHoverBorder: 'hover:border-cyan-500/50'
    },
    {
        bg: 'from-amber-500/10 to-amber-600/5',
        border: 'border-amber-500/30',
        hoverBorder: 'hover:border-amber-500/50',
        accent: 'bg-amber-500',
        glow: 'shadow-amber-500/10',
        text: 'text-amber-400',
        hoverText: 'hover:text-amber-300',
        buttonBg: 'bg-amber-500/10',
        buttonHoverBg: 'hover:bg-amber-500/20',
        buttonBorder: 'border-amber-500/30',
        buttonHoverBorder: 'hover:border-amber-500/50'
    },
    {
        bg: 'from-teal-500/10 to-teal-600/5',
        border: 'border-teal-500/30',
        hoverBorder: 'hover:border-teal-500/50',
        accent: 'bg-teal-500',
        glow: 'shadow-teal-500/10',
        text: 'text-teal-400',
        hoverText: 'hover:text-teal-300',
        buttonBg: 'bg-teal-500/10',
        buttonHoverBg: 'hover:bg-teal-500/20',
        buttonBorder: 'border-teal-500/30',
        buttonHoverBorder: 'hover:border-teal-500/50'
    },
    {
        bg: 'from-indigo-500/10 to-indigo-600/5',
        border: 'border-indigo-500/30',
        hoverBorder: 'hover:border-indigo-500/50',
        accent: 'bg-indigo-500',
        glow: 'shadow-indigo-500/10',
        text: 'text-indigo-400',
        hoverText: 'hover:text-indigo-300',
        buttonBg: 'bg-indigo-500/10',
        buttonHoverBg: 'hover:bg-indigo-500/20',
        buttonBorder: 'border-indigo-500/30',
        buttonHoverBorder: 'hover:border-indigo-500/50'
    },
    {
        bg: 'from-rose-500/10 to-rose-600/5',
        border: 'border-rose-500/30',
        hoverBorder: 'hover:border-rose-500/50',
        accent: 'bg-rose-500',
        glow: 'shadow-rose-500/10',
        text: 'text-rose-400',
        hoverText: 'hover:text-rose-300',
        buttonBg: 'bg-rose-500/10',
        buttonHoverBg: 'hover:bg-rose-500/20',
        buttonBorder: 'border-rose-500/30',
        buttonHoverBorder: 'hover:border-rose-500/50'
    },
    {
        bg: 'from-violet-500/10 to-violet-600/5',
        border: 'border-violet-500/30',
        hoverBorder: 'hover:border-violet-500/50',
        accent: 'bg-violet-500',
        glow: 'shadow-violet-500/10',
        text: 'text-violet-400',
        hoverText: 'hover:text-violet-300',
        buttonBg: 'bg-violet-500/10',
        buttonHoverBg: 'hover:bg-violet-500/20',
        buttonBorder: 'border-violet-500/30',
        buttonHoverBorder: 'hover:border-violet-500/50'
    },
    {
        bg: 'from-lime-500/10 to-lime-600/5',
        border: 'border-lime-500/30',
        hoverBorder: 'hover:border-lime-500/50',
        accent: 'bg-lime-500',
        glow: 'shadow-lime-500/10',
        text: 'text-lime-400',
        hoverText: 'hover:text-lime-300',
        buttonBg: 'bg-lime-500/10',
        buttonHoverBg: 'hover:bg-lime-500/20',
        buttonBorder: 'border-lime-500/30',
        buttonHoverBorder: 'hover:border-lime-500/50'
    }
];

export const getColorScheme = (index: number): ColorScheme => {
    return colorPalette[index % colorPalette.length];
};