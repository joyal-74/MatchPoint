// import { Schema, model, Types, Document } from "mongoose";

// interface ManagerDocument extends Document {
//     userId: Types.ObjectId;
//     wallet: number;
//     tournaments: Types.ObjectId[];
//     teams: Types.ObjectId[];
// }

// const ManagerSchema = new Schema<ManagerDocument>(
//     {
//         userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
//         wallet: { type: Number, default: 0 },
//         tournaments: [{ type: Schema.Types.ObjectId, ref: "Tournament" }],
//         teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
//     },
//     { timestamps: true }
// );

// export const ManagerModel = model<ManagerDocument>("Manager", ManagerSchema);