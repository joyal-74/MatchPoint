import { Zap } from "lucide-react";
import { MatchDetailItem } from "./MatchDetailItem";
import type { MatchData } from "./matchTypes";
import React from "react";

export const MatchDetailsCard: React.FC<{ data: MatchData }> = React.memo(({ data }) => (
    <div className="mt-8 pt-6 border-t border-neutral-700/40">
        <h2 className="text-lg font-semibold text-green-400 mb-3 flex items-center gap-2">
            <Zap size={18} />
            Match Details
        </h2>

        <div className="bg-neutral-900/40 backdrop-blur-md rounded-xl p-4 border border-neutral-700/30">
            <MatchDetailItem label="Match No" value={data.matchNo} />
            <MatchDetailItem label="Venue" value={data.venue} />
            <MatchDetailItem label="Date" value={data.date} />
            <MatchDetailItem label="Time" value={data.time} />
            <MatchDetailItem label="Overs" value={data.overs} />
        </div>
    </div>
));
