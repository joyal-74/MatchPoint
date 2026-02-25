import jwt from "jsonwebtoken";
import { IJWTRepository } from "../../app/repositories/interfaces/providers/IjwtRepository";
import { JwtPayload, JwtTempPayload } from "../../domain/entities/JwtPayload";


const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const TEMP_SECRET = process.env.TEMP_TOKEN_SECRET || "temp_secret_key";

export class JWTService implements IJWTRepository {

    async generateAccessToken(payload: JwtPayload): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" }, (err, token) => {
                if (err || !token) return reject(err);
                resolve(token);
            });
        });
    }

    async generateRefreshToken(payload: JwtPayload): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" }, (err, token) => {
                if (err || !token) return reject(err);
                resolve(token);
            });
        });
    }

    async verifyAccessToken(token: string): Promise<JwtPayload> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
                if (err) return reject(err);
                resolve(decoded as JwtPayload);
            });
        });
    }

    async verifyRefreshToken(token: string): Promise<JwtPayload> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, REFRESH_SECRET, (err, decoded) => {
                if (err) return reject(err);
                resolve(decoded as JwtPayload);
            });
        });
    }
    async generateTempToken(payload: JwtTempPayload): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(payload, TEMP_SECRET, { expiresIn: "10m" }, (err, token) => {
                if (err || !token) return reject(err);
                resolve(token);
            });
        });
    }

    async verifyTempToken(token: string): Promise<JwtTempPayload> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, TEMP_SECRET, (err, decoded) => {
                if (err) return reject(err);
                resolve(decoded as JwtTempPayload);
            });
        });
    }
}
