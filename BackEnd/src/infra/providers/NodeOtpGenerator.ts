import crypto from "node:crypto";
import { IOtpGenerator } from "../../app/providers/IOtpGenerator.js"; 

export class NodeOtpGenerator implements IOtpGenerator {
    generateOtp(): string {
        return crypto.randomInt(100000, 999999).toString();
    }
}
