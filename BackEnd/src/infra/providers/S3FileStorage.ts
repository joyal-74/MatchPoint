// infra/providers/S3FileProvider.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { IFileStorage } from "app/providers/IFileStorage";
import { File } from "domain/entities/File";
import { BadRequestError } from "domain/errors";
import { v4 as uuidv4 } from "uuid";

export class S3FileProvider implements IFileStorage {
    private s3Client: S3Client;
    private bucketName: string;
    private baseUrl: string;

    constructor() {
        this.bucketName = process.env.AWS_S3_BUCKET_NAME || "match-point-s3";

        this.s3Client = new S3Client({
            region: process.env.AWS_REGION || "us-east-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
            },
        });

        this.baseUrl =
            process.env.AWS_S3_BASE_URL ||
            `https://${this.bucketName}.s3.${process.env.AWS_REGION || "us-east-1"}.amazonaws.com`;
    }

    async upload(file: File): Promise<string> {
        const fileKey = `${uuidv4()}-${file.name}`;

        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: fileKey,
                    Body: file.buffer,
                    ContentType: file.type,
                })
            );
            return fileKey;
        } catch (error) {
            throw new BadRequestError(`S3 upload failed: ${(error as Error).message}`);
        }
    }

    getUrl(fileKey: string): string {
        return `${this.baseUrl}/${fileKey}`;
    }
}
