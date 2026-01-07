import "reflect-metadata";
import "./infra/container";
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
import settingsRoutes from "presentation/express/routes/settingsRoutes";
import notificationsRoutes from "presentation/express/routes/notificationsRoute";
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

const API_V1 = "/api/v1";

app.use(`${API_V1}/auth`, authRoutes);
app.use(`${API_V1}/admin`, adminRoutes);
app.use(`${API_V1}/admin/subscriptions`, planRoutes);
app.use(`${API_V1}/manager`, managerRoutes);
app.use(`${API_V1}/player`, playerRoutes);
app.use(`${API_V1}/viewer`, viewerRoutes);
app.use(`${API_V1}/chat`, chatRoutes);
app.use(`${API_V1}/subscriptions`, subscriptionsRoutes);
app.use(`${API_V1}/leaderboard`, leaderboardRoutes);
app.use(`${API_V1}/match`, matchRoutes);
app.use(`${API_V1}/settings`, settingsRoutes);
app.use(`${API_V1}/notifications`, notificationsRoutes);

app.use(errorHandler);

export default app;