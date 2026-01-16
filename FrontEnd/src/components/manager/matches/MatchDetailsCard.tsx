import React from "react";
import { Info } from "lucide-react";
import type { MatchData } from "./matchTypes";
import { MatchDetailItem } from "./MatchDetailItem";

export const MatchDetailsCard: React.FC<{ data: MatchData }> = React.memo(({ data }) => {
    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
                <h2 className="text-md font-semibold text-foreground flex items-center gap-2">
                    <Info size={16} className="text-primary" />
                    Details
                </h2>
            </div>
            <div className="p-0">
                <MatchDetailItem label="Overs" value={data.overs} />
                <MatchDetailItem label="Venue" value={data.venue} />
                <MatchDetailItem label="Date" value={data.date} />
                <MatchDetailItem label="Time" value={data.time} />
            </div>
        </div>
    );
});