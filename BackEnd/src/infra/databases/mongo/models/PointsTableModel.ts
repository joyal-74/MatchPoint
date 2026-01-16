import { Schema, Types, model } from 'mongoose';
import { PointsRow } from 'domain/entities/Tournaments';

export interface PointsTableDocument extends Omit<PointsRow, "tournamentId"> {
    tournamentId: Types.ObjectId;
    teamId: Types.ObjectId;
    groupName: string | null;
}


const PointsTableSchema = new Schema<PointsTableDocument>({
    tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
    rank: { type: Number, default: 0 },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    team: { type: String, required: true },
    p: { type: Number, default: 0 },
    w: { type: Number, default: 0 },
    l: { type: Number, default: 0 },
    t: { type: Number, default: 0 },
    nrr: { type: String, default: '0.000' },
    pts: { type: Number, default: 0 },
    groupName: { type: String, default: null },
    form: [{ type: String }],
}, { timestamps: true });

export const PointsTableModel = model<PointsTableDocument>('PointsTable', PointsTableSchema);