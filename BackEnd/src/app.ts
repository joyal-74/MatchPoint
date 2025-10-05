import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "presentation/express/routes/authRoutes";
import adminRoutes from "presentation/express/routes/adminRoutes";
import managerRoutes from "presentation/express/routes/managerRoutes";
import playerRoutes from "presentation/express/routes/playerRoutes";
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
app.use("/manager", managerRoutes);
app.use("/player", playerRoutes);

app.use(errorHandler);

export default app;