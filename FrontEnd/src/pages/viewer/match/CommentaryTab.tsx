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
            case 'WICKET': return 'border-red-500 bg-red-900/10';
            case 'FOUR': return 'border-blue-500 bg-blue-900/10';
            case 'SIX': return 'border-purple-500 bg-purple-900/10';
            default: return 'border-neutral-700 hover:bg-neutral-800/50';
        }
    };

    const getBadgeStyle = (type: string) => {
        switch (type) {
            case 'WICKET': return 'bg-red-500 text-white';
            case 'FOUR': return 'bg-blue-600 text-white';
            case 'SIX': return 'bg-purple-600 text-white';
            default: return 'bg-neutral-700 text-neutral-300';
        }
    };

    if (!commentary || commentary.length === 0) {
        return (
            <div className="text-center py-12 bg-neutral-800 rounded-xl border border-neutral-700">
                <div className="text-neutral-500 text-lg">No commentary data available yet.</div>
                <div className="text-neutral-600 text-sm mt-2">Waiting for the match to start...</div>
            </div>
        );
    }

    const reversedCommentary = commentary.slice().reverse();
    console.log(reversedCommentary)

    return (
        <div className="space-y-4">
            {reversedCommentary.map((item) => (
                <div 
                    key={item.ball}
                    className={`flex gap-4 p-4 rounded-lg border-l-4 transition-colors ${getEventStyle(item.type)}`}
                >
                    {/* Ball Number Bubble */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 font-bold text-white shadow-sm">
                            {item.ball}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-white text-lg">
                                {item.type !== 'NORMAL' && (
                                    <span className={`text-xs px-2 py-0.5 rounded mr-2 ${getBadgeStyle(item.type)}`}>
                                        {item.type}
                                    </span>
                                )}
                                {item.runs !== undefined && (
                                    <span className="text-xs px-2 py-0.5 rounded bg-green-600 text-white">
                                        +{item.runs}
                                    </span>
                                )}
                            </span>
                        </div>
                        <p className="text-neutral-300 leading-relaxed">{item.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};