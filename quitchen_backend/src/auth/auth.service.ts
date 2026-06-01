import { Injectable, UnauthorizedException } from '@nestjs/common'
import { auth } from './auth.config'

@Injectable()

export class AuthService {
    getAuthHandler() {
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

    async seedAdmin() {
        try {
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@quitchen.com';
            const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!@#';
            const adminName = process.env.ADMIN_NAME || 'Quitchen Admin';

            await auth.api.signUpEmail({
                body: {
                    email: adminEmail,
                    password: adminPassword,
                    name: adminName,
                    phone: '0794889741',
                },
            });
            console.log("Admin Account Created Sucessfully")
        } catch (error: any) {
            if (error?.message?.includes('already exists') ||
                error?.body?.message?.includes('already exists')) {
                console.log('Admin account already exists, skipping seed');
            } else {
                console.error("Failed to seed Admin")
            }
        }
    }
}