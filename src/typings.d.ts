// Typings reference file, you can add your own global typings here
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;

declare module 'crypto-js' {

    interface CryptoJS {
        SHA256;
        SHA512;
        AES:AES;
        enc:enc;

    }

    interface AES {
        encrypt(text: string, secret: string): any;
        decrypt(ciphertext: string, secret: string): any;
    }

    interface enc {
        Utf8: any;
    }

    function SHA256(text: string): string;
    function SHA512(text: string): string;

    var cryptoJS: CryptoJS;
    export = cryptoJS;
}