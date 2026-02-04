import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

export class MongoConnection {
    static async connect(): Promise<void> {
        try {
            await mongoose.connect(process.env.MONGO_URI as string);
            console.log("✅ Connected to MongoDB");
        } catch (error) {
            console.error("❌ MongoDB connection error:", error);
            process.exit(1);
        }
    }
}
