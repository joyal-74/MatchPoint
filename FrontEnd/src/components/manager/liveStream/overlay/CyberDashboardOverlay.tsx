import { motion } from 'framer-motion';

export const CyberDashboardOverlay = ({ data }) => (
    <motion.div
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        className="w-full h-20 bg-card border-t-4 border-primary grid grid-cols-4 divide-x divide-border shadow-[0_-20px_40px_rgba(0,0,0,0.4)]"
    >
        {/* Box 1: Core Score */}
        <div className="flex flex-col justify-center px-8 bg-muted/20">
            <span className="text-[10px] font-black text-primary italic uppercase tracking-widest">Live Match</span>
            <div className="flex items-baseline gap-2 leading-none">
                <span className="text-3xl font-black">154/4</span>
                <span className="text-sm font-bold opacity-40">16.2 OV</span>
            </div>
        </div>

        {/* Box 2: Batsmen */}
        <div className="col-span-1 flex flex-col justify-center px-8 gap-1">
            <div className="flex justify-between items-center bg-primary/5 p-1 rounded border-l-2 border-primary">
                <span className="text-xs font-bold">P. Bose*</span>
                <span className="text-xs font-black">42 <span className="text-[10px] font-normal opacity-50">(28)</span></span>
            </div>
            <div className="flex justify-between items-center p-1 opacity-50">
                <span className="text-xs font-bold">Joyal</span>
                <span className="text-xs font-black">12 <span className="text-[10px] font-normal opacity-50">(10)</span></span>
            </div>
        </div>

        {/* Box 3: Bowler & Target */}
        <div className="flex flex-col justify-center px-8">
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase mb-1">
                <span>Target</span>
                <span>RR</span>
            </div>
            <div className="flex justify-between items-baseline leading-none">
                <span className="text-xl font-black italic">188</span>
                <span className="text-sm font-mono font-bold text-primary">9.42</span>
            </div>
        </div>

        {/* Box 4: Recent Form */}
        <div className="flex flex-col justify-center px-8 bg-muted/10">
            <span className="text-[9px] font-black uppercase text-muted-foreground mb-2">Recent Timeline</span>
            <div className="flex gap-2">
                {['•', '4', '6', 'W', '1', '1'].map((ball, i) => (
                    <div key={i} className="flex-1 h-6 bg-background border border-border flex items-center justify-center rounded text-[10px] font-black">
                        {ball}
                    </div>
                ))}
            </div>
        </div>
    </motion.div>
);