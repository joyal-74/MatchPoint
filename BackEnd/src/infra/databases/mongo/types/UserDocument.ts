import { ObjectId } from "mongoose";
import { User } from "domain/entities/User";

export type UserDocument = User & { _id: ObjectId };