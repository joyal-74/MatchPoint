import { User } from "@core/domain/entities/User";

export type PersistedUser = User & { _id: string };