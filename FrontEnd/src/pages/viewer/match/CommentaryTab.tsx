import { Activity } from "lucide-react";

export interface CommentaryItem {
    ball: string; // "14.2"
    text: string; // "Bowled him! That's a great delivery."
    type: 'WICKET' | 'FOUR' | 'SIX' | 'NORMAL' | 'WIDE' | 'NOBALL';
    runs?: number;
}

interface CommentaryTabProps {
    commentary: CommentaryItem[];
}

export const CommentaryTab = ({ commentary }: CommentaryTabProps) => {
    
    // Helper to get styling based on event type
    const getEventStyle = (type: string) => {
        switch (type) {
            case 'WICKET': return 'border-red-500 bg-red-500/5';
            case 'FOUR': return 'border-blue-500 bg-blue-500/5';
            case 'SIX': return 'border-purple-500 bg-purple-500/5';
            default: return 'border-border hover:bg-muted/30';
        }
    };

    const getBadgeStyle = (type: string) => {
        switch (type) {
            case 'WICKET': return 'bg-red-500 text-white shadow-red-500/20 shadow-lg';
            case 'FOUR': return 'bg-blue-600 text-white shadow-blue-600/20 shadow-lg';
            case 'SIX': return 'bg-purple-600 text-white shadow-purple-600/20 shadow-lg';
            case 'WIDE': 
            case 'NOBALL': return 'bg-yellow-500 text-white';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getBallBubbleStyle = (type: string) => {
        switch(type) {
            case 'WICKET': return 'bg-red-100 text-red-700 border-red-200';
            case 'FOUR': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'SIX': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    if (!commentary || commentary.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-dashed border-border text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Activity className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <div className="text-foreground font-medium text-lg">No commentary yet</div>
                <div className="text-muted-foreground text-sm mt-1 max-w-xs">
                    Live updates will appear here as soon as the match begins.
                </div>
            </div>
        );
    }

    // Clone and reverse to show newest first
    const reversedCommentary = [...commentary].reverse();

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {reversedCommentary.map((item, index) => (
                <div 
                    key={`${item.ball}-${index}`}
                    className={`flex gap-5 p-5 rounded-xl border-l-[6px] shadow-sm transition-all duration-200 bg-card ${getEventStyle(item.type)}`}
                >
                    {/* Ball Number Bubble */}
                    <div className="flex-shrink-0 pt-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold text-sm shadow-sm ${getBallBubbleStyle(item.type)}`}>
                            {item.ball}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            
                            {/* Event Badge */}
                            {item.type !== 'NORMAL' && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${getBadgeStyle(item.type)}`}>
                                    {item.type}
                                </span>
                            )}

                            {/* Runs Badge */}
                            {item.runs !== undefined && item.runs > 0 && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow-sm">
                                    +{item.runs} RUNS
                                </span>
                            )}
                        </div>
                        
                        <p className="text-foreground leading-relaxed text-sm md:text-base font-medium">
                            {item.text}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};