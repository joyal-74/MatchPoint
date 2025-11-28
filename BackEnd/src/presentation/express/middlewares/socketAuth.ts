import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { UserModel } from "infra/databases/mongo/models/UserModel";

export interface AuthenticatedSocket extends Socket {
    user?: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
    };
}

export const authenticateSocket = async (
    socket: AuthenticatedSocket,
    next: (err?: Error) => void
) => {
    try {
        const cookies = socket.handshake.headers.cookie;

        if (!cookies) {
            return next(new Error("Authentication error: No cookies found"));
        }

        const accessTokenCookie = cookies
            .split(";")
            .find((c) => c.trim().startsWith("accessToken="));

            console.log(accessTokenCookie, "???")

        if (!accessTokenCookie) {
            return next(new Error("Authentication error: No accessToken found"));
        }

        const token = accessTokenCookie.split("=")[1];

        if (!token) {
            return next(new Error("Authentication error: Empty token"));
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
            userId: string;
            role: string;
        };

        // Fetch user from DB
        const user = await UserModel.findById(decoded.userId).select(
            "_id firstName lastName email role"
        );

        if (!user) {
            return next(new Error("Authentication error: User not found"));
        }

        socket.user = {
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };

        console.log(`✅ Socket Authenticated: ${user.firstName} ${user.lastName}`);

        next();
    } catch (err) {
        console.log("❌ Socket authentication failed:", err);
        next(new Error("Authentication error: Invalid or expired token"));
    }
};
