import { Schema, model, Document } from "mongoose";

interface Criteria {
    type: string;
    field: string;
    formula?: string;
}

interface Award {
    name: string;
    criteria: Criteria[];
}

interface MetadataField {
    key: string;
    value: string;
    stat_field?: string;
}

interface MatchEvent {
    key: string;
    label: string;
    player_stat_field: string;
    value: string;
    metadata_fields: MetadataField[];
}

interface Category {
    key: string;
    type: string;
    label: string;
}

export interface StatsConfigDocument extends Document {
    sport: string;
    category: Category[];
    awards: Award[];
    match_events: MatchEvent[];
    created_at: Date;
    updated_at: Date;
}

const CriteriaSchema = new Schema(
    {
        type: { type: String, required: true },
        field: { type: String, required: true },
        formula: { type: String },
    },
    { _id: false }
);

const AwardSchema = new Schema(
    {
        name: { type: String, required: true },
        criteria: { type: [CriteriaSchema], default: [] },
    },
    { _id: false }
);

const MetadataFieldSchema = new Schema(
    {
        key: { type: String, required: true },
        value: { type: String, required: true },
        stat_field: { type: String },
    },
    { _id: false }
);

const MatchEventSchema = new Schema(
    {
        key: { type: String, required: true },
        label: { type: String, required: true },
        player_stat_field: { type: String, required: true },
        value: { type: String, required: true },
        metadata_fields: { type: [MetadataFieldSchema], default: [] },
    },
    { _id: false }
);

const CategorySchema = new Schema(
    {
        key: { type: String, required: true },
        type: { type: String, required: true },
        label: { type: String, required: true },
    },
    { _id: false }
);

const StatsConfigSchema = new Schema<StatsConfigDocument>(
    {
        sport: { type: String, required: true },
        category: { type: [CategorySchema] as any, default: [] },
        awards: { type: [AwardSchema] as any, default: [] },
        match_events: { type: [MatchEventSchema] as any, default: [] },
    },
    { timestamps: true, }
);

export const StatsConfigModel = model<StatsConfigDocument>( "StatsConfig", StatsConfigSchema );