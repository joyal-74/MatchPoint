import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import userRoutes from './infrastructure/http/Express/routes/userRoutes'
import adminRoutes from './infrastructure/http/Express/routes/AdminRoutes'


const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(helmet());

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/", userRoutes);
app.use("/admin", adminRoutes);

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;