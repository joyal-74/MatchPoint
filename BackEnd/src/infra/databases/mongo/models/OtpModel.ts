import { Schema, model } from "mongoose";

const OTPSchema = new Schema({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }
});

const OTPModel = model("Otp", OTPSchema);

export default OTPModel;