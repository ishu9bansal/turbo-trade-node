import { Request, Response, NextFunction } from 'express';
import { verifyToken as clerkVerifyToken } from '@clerk/backend';

interface ClerkTokenPayload {
    azp: string;
    exp: number;
    fva: number[];
    iat: number;
    iss: string;
    nbf: number;
    sid: string;
    sub: string;
    v: number;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer '))
            return res.status(401).json({ message: 'No token provided' });
        
        const token = authHeader.split(' ')[1];
        const secretKey = process.env.CLERK_SECRET_KEY;
        
        if (!secretKey) 
            return res.status(500).json({ message: 'Missing Clerk secret key' });
        
        const decoded = await clerkVerifyToken(token, { secretKey }) as ClerkTokenPayload;
        // const decoded = { sub: "user_2yH0JWs0UtmoeQABQtmfYtq64cU" };

        req.user = decoded;  // <-- This will need a small TS tweak (explained below)

        next();
    } catch (err) {
        console.error('Auth Middleware Error:', err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
