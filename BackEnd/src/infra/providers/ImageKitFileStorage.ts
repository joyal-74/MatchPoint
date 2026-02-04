
import ImageKit from "imagekit";
import { v4 as uuidv4 } from 'uuid';
import { IFileStorage } from "../../app/providers/IFileStorage.js";
import { File } from "../../domain/entities/File.js";


export class ImageKitFileStorage implements IFileStorage {
    private imagekit: ImageKit;
    private baseUrl: string;


    constructor() {
        this.imagekit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
        });

        this.baseUrl = process.env.IMAGEKIT_URL_ENDPOINT!;
    }

    async upload(file: File): Promise<string> {
        const res = await this.imagekit.upload({
            file: file.buffer,
            fileName: `${uuidv4()}-${file.name}`,
        });
        return res.url;
    }

    getUrl(fileKey: string): string {
        return `${this.baseUrl}/${fileKey}`;
    }
}
