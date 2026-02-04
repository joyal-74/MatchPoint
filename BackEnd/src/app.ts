import "reflect-metadata";
import "./infra/container/index.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./presentation/express/routes/authRoutes.js";
import adminRoutes from "./presentation/express/routes/adminRoutes.js";
import planRoutes from "./presentation/express/routes/planRoutes.js";
import managerRoutes from "./presentation/express/routes/managerRoutes.js";
import umpireRoutes from "./presentation/express/routes/umpireRoutes.js";
import playerRoutes from "./presentation/express/routes/playerRoutes.js";
import viewerRoutes from "./presentation/express/routes/viewerRoutes.js";
import subscriptionsRoutes from "./presentation/express/routes/subscriptionsRoutes.js";
import chatRoutes from "./presentation/express/routes/chatRoutes.js";
import leaderboardRoutes from "./presentation/express/routes/leaderboardRoutes.js";
import matchRoutes from "./presentation/express/routes/matchRoutes.js";
import settingsRoutes from "./presentation/express/routes/settingsRoutes.js";
import notificationsRoutes from "./presentation/express/routes/notificationsRoute.js";
import cookieParser from 'cookie-parser';
import { ErrorHandler } from "./presentation/express/middlewares/errorHandler.js";
import { container } from "tsyringe";

const app = express();

const isProduction = process.env.NODE_ENV === "production";

// const corsOptions = {
//     origin: process.env.FRONTEND_URL || "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// };

const corsOptions = {
    origin: isProduction
        ? true
        : process.env.FRONTEND_URL || "http://localhost:5173",
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
app.use(`${API_V1}/umpire`, umpireRoutes);
app.use(`${API_V1}/chat`, chatRoutes);
app.use(`${API_V1}/subscriptions`, subscriptionsRoutes);
app.use(`${API_V1}/leaderboard`, leaderboardRoutes);
app.use(`${API_V1}/match`, matchRoutes);
app.use(`${API_V1}/settings`, settingsRoutes);
app.use(`${API_V1}/notifications`, notificationsRoutes);

const errorHandler = container.resolve(ErrorHandler);
app.use(errorHandler.handle);

export default app;
