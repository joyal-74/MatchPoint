import { motion } from 'framer-motion';

export const EliteBroadcastOverlay = ({ data }) => {
    // Mock data for display - replace with stream.matchScore
    const stats = data || {
        runs: 154, wickets: 4, overs: '16.2', target: 188,
        batsman1: { name: 'P. Bose', runs: 42, balls: 28, strike: true },
        batsman2: { name: 'Joyal', runs: 12, balls: 10, strike: false },
        bowler: { name: 'A. Mol', figures: '2/24', overs: '3.2' },
        recentBalls: ['1', '4', 'W', '0', '6', '1wd']
    };

    return (
        <motion.div
            initial={{ y: 100 }} animate={{ y: 0 }}
            className="w-full h-16 bg-card/95 backdrop-blur-md border-t border-border flex items-center shadow-2xl overflow-hidden"
        >
            {/* 1. PRIMARY SCORE BOX */}
            <div className="h-full bg-primary flex items-center px-6 gap-4 min-w-[200px] shadow-[10px_0_15px_rgba(0,0,0,0.2)] z-20">
                <div className="flex flex-col leading-none">
                    <span className="text-[10px] font-black text-primary-foreground/60 uppercase italic">Innings 1</span>
                    <span className="text-2xl font-black text-primary-foreground">{stats.runs}/{stats.wickets}</span>
                </div>
                <div className="h-8 w-px bg-primary-foreground/20" />
                <span className="text-sm font-bold text-primary-foreground/90">{stats.overs} <span className="text-[10px]">OV</span></span>
            </div>

            {/* 2. BATSMEN SECTION */}
            <div className="flex-1 flex items-center px-6 gap-8 overflow-hidden border-r border-border/50 h-full">
                {[stats.batsman1, stats.batsman2].map((player, i) => (
                    <div key={i} className={`flex items-center gap-2 ${player.strike ? 'opacity-100' : 'opacity-50'}`}>
                        {player.strike && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
                        <span className="text-xs font-black uppercase tracking-tighter truncate max-w-[80px]">{player.name}</span>
                        <span className="text-sm font-mono font-bold">{player.runs}<span className="text-[10px] font-normal opacity-60">({player.balls})</span></span>
                    </div>
                ))}
            </div>

            {/* 3. BOWLER SECTION */}
            <div className="px-6 flex items-center gap-4 border-r border-border/50 h-full bg-muted/30">
                <div className="flex flex-col leading-none">
                    <span className="text-[9px] font-black text-muted-foreground uppercase">Bowler</span>
                    <span className="text-xs font-bold truncate max-w-[80px]">{stats.bowler.name}</span>
                </div>
                <span className="text-sm font-mono font-black text-primary">{stats.bowler.figures}</span>
            </div>

            {/* 4. RECENT BALLS (The Ticker) */}
            <div className="px-6 flex items-center gap-2 h-full bg-muted/10">
                <span className="text-[9px] font-black text-muted-foreground uppercase mr-2">This Over</span>
                {stats.recentBalls.map((ball, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border
            ${ball === 'W' ? 'bg-destructive text-white border-destructive' :
                            ball === '4' || ball === '6' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground'}`}>
                        {ball}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};