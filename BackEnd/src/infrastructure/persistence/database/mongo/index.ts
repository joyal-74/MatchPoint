// import mongoose from "mongoose";
// import { config } from "@shared/config/env";

// export class MongoConnection {
//     static async connect(): Promise<void> {
//         try {
//             await mongoose.connect(config.mongoUri);
//             console.log("✅ Connected to MongoDB");
//         } catch (error) {
//             console.error("❌ MongoDB connection error:", error);
//             process.exit(1);
//         }
//     }
// }