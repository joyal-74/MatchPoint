import { File } from "domain/entities/File";

export interface IFileStorage {
    upload(file: File): Promise<string>;
    getUrl(fileKey: string): string;
}