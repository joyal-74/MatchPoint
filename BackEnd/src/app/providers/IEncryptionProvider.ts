export interface IEncryptionProvider {
    encrypt(text: string): string;
    decrypt(hash: string): string;
}
