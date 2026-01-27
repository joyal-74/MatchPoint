import { motion } from 'framer-motion';

export const EliteBroadcastOverlay = ({ data }) => {
    // 1. Fallback / Default state to prevent "undefined" errors
    const stats = data || {
        runs: 0, wickets: 0, overs: '0.0', target: 0,
        batsman1: { name: 'Waiting...', runs: 0, balls: 0, strike: false },
        batsman2: { name: 'Waiting...', runs: 0, balls: 0, strike: false },
        bowler: { name: 'Waiting...', figures: '0/0', overs: '0.0' },
        recentBalls: []
    };

    // 2. Double-check nested properties specifically (The "Strike" fix)
    const b1 = stats.batsman1 || { name: '-', runs: 0, balls: 0, strike: false };
    const b2 = stats.batsman2 || { name: '-', runs: 0, balls: 0, strike: false };
    const bw = stats.bowler || { name: '-', figures: '0/0' };

    return (
        <motion.div
            initial={{ y: 100 }} 
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="absolute bottom-0 left-0 w-full h-16 bg-card/95 backdrop-blur-md border-t border-border flex items-center shadow-2xl overflow-hidden z-50"
        >
            {/* 1. PRIMARY SCORE BOX */}
            <div className="h-full bg-primary flex items-center px-6 gap-4 min-w-[180px] shadow-[10px_0_15px_rgba(0,0,0,0.2)] z-20">
                <div className="flex flex-col leading-none">
                    <span className="text-[10px] font-black text-primary-foreground/60 uppercase italic tracking-tighter">Live Score</span>
                    <span className="text-2xl font-black text-primary-foreground">
                        {stats.runs}/{stats.wickets}
                    </span>
                </div>
                <div className="h-8 w-px bg-primary-foreground/20" />
                <span className="text-sm font-bold text-primary-foreground/90 whitespace-nowrap">
                    {stats.overs} <span className="text-[10px] opacity-70">OV</span>
                </span>
            </div>

            {/* 2. BATSMEN SECTION */}
            <div className="flex-1 flex items-center px-6 gap-8 overflow-hidden border-r border-border/50 h-full bg-background/20">
                {[b1, b2].map((player, i) => (
                    <div key={i} className={`flex items-center gap-2 transition-opacity duration-300 ${player?.strike ? 'opacity-100' : 'opacity-40'}`}>
                        {player?.strike && (
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1] }} 
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]" 
                            />
                        )}
                        <div className="flex flex-col leading-tight">
                            <span className="text-[11px] font-black uppercase tracking-tighter truncate max-w-[90px]">
                                {player?.name}
                            </span>
                            <span className="text-xs font-mono font-bold text-primary">
                                {player?.runs}
                                <span className="text-[10px] font-normal text-muted-foreground ml-1">
                                    ({player?.balls})
                                </span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. BOWLER SECTION */}
            <div className="px-6 flex items-center gap-4 border-r border-border/50 h-full bg-muted/30">
                <div className="flex flex-col leading-none">
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Bowler</span>
                    <span className="text-[11px] font-bold truncate max-w-[80px] uppercase italic">
                        {bw?.name}
                    </span>
                </div>
                <div className="flex flex-col items-end leading-none">
                    <span className="text-sm font-mono font-black text-primary">
                        {bw?.figures}
                    </span>
                </div>
            </div>

            {/* 4. RECENT BALLS (The Ticker) */}
            <div className="px-6 lg:flex hidden items-center gap-2 h-full bg-muted/10">
                <span className="text-[9px] font-black text-muted-foreground uppercase mr-2 tracking-tighter">Recent</span>
                <div className="flex gap-1.5">
                    {(stats.recentBalls || []).slice(-6).map((ball, i) => (
                        <div 
                            key={i} 
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-transform hover:scale-110
                            ${ball === 'W' ? 'bg-destructive text-white border-destructive shadow-lg shadow-destructive/20' :
                              ['4', '6'].includes(ball) ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 
                              'border-border text-foreground bg-background/50'}`}
                        >
                            {ball}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};