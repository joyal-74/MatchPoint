import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/matchpoint",
  nodeEnv: process.env.NODE_ENV || "development",
};
