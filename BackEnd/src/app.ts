import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "presentation/express/routes/authRoutes";
import adminRoutes from "presentation/express/routes/adminRoutes";
import planRoutes from "presentation/express/routes/planRoutes";
import managerRoutes from "presentation/express/routes/managerRoutes";
import playerRoutes from "presentation/express/routes/playerRoutes";
import viewerRoutes from "presentation/express/routes/viewerRoutes";
import subscriptionsRoutes from "presentation/express/routes/subscriptionsRoutes";
import chatRoutes from "presentation/express/routes/chatRoutes";
import leaderboardRoutes from "presentation/express/routes/leaderboardRoutes";
import matchRoutes from "presentation/express/routes/matchRoutes";
import { errorHandler } from "presentation/express/middlewares/errorHandler";
import cookieParser from 'cookie-parser';

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(helmet());

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/subscriptions", planRoutes);
app.use("/manager", managerRoutes);
app.use("/player", playerRoutes);
app.use("/viewer", viewerRoutes);
app.use("/chat", chatRoutes);
app.use("/subscriptions", subscriptionsRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/match", matchRoutes);

app.use(errorHandler);

export default app;