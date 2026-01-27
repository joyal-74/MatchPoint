import { motion } from 'framer-motion';

export const CyberDashboardOverlay = ({ data }) => {
    const stats = data || {
        runs: 0, wickets: 0, overs: '0.0', target: 0,
        batsman1: { name: 'P. Bose', runs: 0, balls: 0, strike: true },
        batsman2: { name: 'Joyal', runs: 0, balls: 0, strike: false },
        recentBalls: ['•', '•', '•', '•', '•', '•']
    };

    // Calculate Required Run Rate (RR) safely
    const rr = stats.target > 0 ? (stats.target / 20).toFixed(2) : "0.00";

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="absolute bottom-0 left-0 w-full h-20 bg-card/95 backdrop-blur-md border-t-4 border-primary grid grid-cols-4 divide-x divide-border shadow-[0_-20px_40px_rgba(0,0,0,0.4)] z-50"
        >
            {/* Box 1: Core Score */}
            <div className="flex flex-col justify-center px-8 bg-primary/5">
                <span className="text-[10px] font-black text-primary italic uppercase tracking-[0.2em]">Match Analytics</span>
                <div className="flex items-baseline gap-2 leading-none">
                    <span className="text-3xl font-black tracking-tighter">
                        {stats.runs}/{stats.wickets}
                    </span>
                    <span className="text-xs font-mono font-bold opacity-40">
                        {stats.overs} <span className="text-[9px]">OV</span>
                    </span>
                </div>
            </div>

            {/* Box 2: Batsmen (Defensive Mapping) */}
            <div className="col-span-1 flex flex-col justify-center px-6 gap-1.5">
                {[stats.batsman1, stats.batsman2].map((player, i) => (
                    <div
                        key={i}
                        className={`flex justify-between items-center px-2 py-1 rounded transition-all ${player?.strike
                                ? 'bg-primary/10 border-l-2 border-primary shadow-sm'
                                : 'opacity-40 border-l-2 border-transparent'
                            }`}
                    >
                        <span className="text-[11px] font-black uppercase truncate max-w-[100px]">
                            {player?.name || '---'}
                            {player?.strike && <span className="text-primary ml-1">*</span>}
                        </span>
                        <span className="text-[11px] font-mono font-black">
                            {player?.runs || 0}
                            <span className="text-[9px] font-normal opacity-60 ml-1">({player?.balls || 0})</span>
                        </span>
                    </div>
                ))}
            </div>

            {/* Box 3: Targets & Math */}
            <div className="flex flex-col justify-center px-8">
                <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase mb-1 tracking-widest">
                    <span>Target</span>
                    <span>Req. RR</span>
                </div>
                <div className="flex justify-between items-baseline leading-none">
                    <span className="text-2xl font-black italic tracking-tighter">
                        {stats.target || 'N/A'}
                    </span>
                    <span className="text-sm font-mono font-black text-primary">
                        {rr}
                    </span>
                </div>
            </div>

            {/* Box 4: Recent Form / Timeline */}
            <div className="flex flex-col justify-center px-8 bg-muted/5">
                <span className="text-[9px] font-black uppercase text-muted-foreground mb-2 tracking-widest">Live Timeline</span>
                <div className="flex gap-1.5">
                    {(stats.recentBalls || []).slice(-6).map((ball, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-7 bg-background border border-border flex items-center justify-center rounded-md text-[10px] font-black transition-all
                            ${ball === 'W' ? 'bg-destructive text-destructive-foreground border-destructive' :
                                    ['4', '6'].includes(ball) ? 'text-primary border-primary bg-primary/5' : ''}`}
                        >
                            {ball}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};