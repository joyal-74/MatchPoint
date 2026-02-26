import crypto from 'crypto';
import { IEncryptionProvider } from '../../app/providers/IEncryptionProvider';

export class CryptoEncryptionProvider implements IEncryptionProvider {
    private readonly algorithm = 'aes-256-cbc';
    private readonly key: Buffer;
    private readonly ivLength = 16;

    constructor(encryptionKey: string) {
        this.key = Buffer.from(encryptionKey);
    }

    encrypt(text: string): string {
        const iv = crypto.randomBytes(this.ivLength);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    }

    decrypt(hash: string): string {
        const [ivHex, encryptedHex] = hash.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedText = Buffer.from(encryptedHex, 'hex');
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
