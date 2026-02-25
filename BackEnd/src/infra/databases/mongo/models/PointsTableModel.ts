import { PointsRow } from '../../../../domain/entities/PointsTable';
import { Schema, Types, model } from 'mongoose';

export interface PointsTableDocument extends Omit<PointsRow, "tournamentId" | "teamId" | "_id"> {
    tournamentId: Types.ObjectId;
    teamId: Types.ObjectId;
    _id: Types.ObjectId;
    groupName: string;
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
