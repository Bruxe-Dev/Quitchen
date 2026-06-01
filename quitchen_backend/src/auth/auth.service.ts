import { Injectable, UnauthorizedException } from '@nestjs/common'
import { auth } from './auth.config'

@Injectable()

export class AuthService {
    getAUthHandler() {
        return auth.handler;
    }

    async validateSession(request: Request): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            phone: string;
        };
        session: { id: string; expiresAt: Date };
    } | null> {
        try {
            // Better Auth reads the session cookie/header automatically from the request
            const session = await auth.api.getSession({
                headers: request.headers as any,
            });
            return session as any;
        } catch {
            return null;
        }
    }
}