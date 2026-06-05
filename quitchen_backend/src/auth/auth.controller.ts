import { All, Req, Res, Controller, Post, Get } from '@nestjs/common'
import { AuthService } from './auth.service';
import { CurrentUser } from '../common/decorators/auth.decorator';
import { Public } from '../common/decorators/public.decorator';
import type { AuthenticatedUser } from './types';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Specific routes first (higher priority)
    @Post('logout')
    async logout() {
        // Better Auth clears the session cookie automatically
        return { message: 'Logged out successfully' };
    }

    @Get('me')
    async getCurrentUser(@CurrentUser() user: AuthenticatedUser) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            image: user.image
        }
    }

    @Public()
    @Get('health')
    async health() {
        return { status: "Auth Service is running" }
    }

    // Catch-all for Better Auth (lowest priority - last)
    @All('*')
    async handleAuth(@Req() req: Request, @Res() res: Response) {
        const url = new URL(
            req.url,
            `http://${(req.headers as any).host || 'localhost'}`,
        );

        const webRequest = new Request(url, {
            method: req.method,
            headers: req.headers as any,
            body: ['GET', 'HEAD'].includes(req.method)
                ? undefined
                : JSON.stringify((req as any).body),
        });

        const response = await this.authService.getAuthHandler()(webRequest);

        const responseBody = await response.text();

        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        res.status(response.status).send(responseBody);
    }
}