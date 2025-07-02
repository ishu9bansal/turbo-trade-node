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

export const verifyToken = async (token: string): Promise<ClerkTokenPayload> => {
    const secretKey = process.env.CLERK_SECRET_KEY;

    if (!secretKey) {
        throw new Error("Missing Clerk secret key");
    }
    // return {sub: "user_2yH0JWs0UtmoeQABQtmfYtq64cU"}
    try {
        const obj = await clerkVerifyToken(token, { secretKey });
        console.log("Decoded Clerk payload:", obj);
        return obj as ClerkTokenPayload;
    } catch (err) {
        console.error("Token verification failed:", err);
        throw new Error("Invalid token");
    }
};
