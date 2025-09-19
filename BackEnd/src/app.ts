import express, { Request, Response} from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// import userRoutes from './infrastructure/http/Express/routes/userRoutes'
// import adminRoutes from './infrastructure/http/Express/routes/AdminRoutes'
import authRoutes from "presentation/express/routes/authRoutes";
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

// app.use("/", userRoutes);
// app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
});

app.use(errorHandler);

export default app;