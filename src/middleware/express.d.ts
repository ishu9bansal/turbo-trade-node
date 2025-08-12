import 'express';

declare module 'express' {
    interface Request {
        user?: {
            azp: string;
            exp: number;
            fva: number[];
            iat: number;
            iss: string;
            nbf: number;
            sid: string;
            sub: string;
            v: number;
        };
    }
}
