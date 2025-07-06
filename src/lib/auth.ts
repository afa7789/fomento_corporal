import jwt from 'jsonwebtoken';
import type { User, UserType } from './types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export interface JWTPayload {
    id: number;
    username: string;
    type: UserType;
    name: string;
}

export function generateToken(user: User | { id: number; username: string; name: string; type: UserType }): string {
    const payload: JWTPayload = {
        id: user.id,
        username: user.username,
        type: user.type,
        name: user.name
    };
    
    return jwt.sign(payload, JWT_SECRET, { 
        expiresIn: '24h',
        issuer: 'fomento-corporal',
        audience: 'fomento-users'
    });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: 'fomento-corporal',
            audience: 'fomento-users'
        }) as JWTPayload;
        
        return decoded;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
}

export function isTokenExpired(token: string): boolean {
    try {
        const decoded = jwt.decode(token) as any;
        if (!decoded || !decoded.exp) return true;
        
        return Date.now() >= decoded.exp * 1000;
    } catch {
        return true;
    }
}
