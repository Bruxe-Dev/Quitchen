import { All, Req, Res, Controller, Post, Get, Body } from '@nestjs/common'
import { AuthService } from './auth.service';
import { CurrentUser } from '../common/decorators/auth.decorator';
import { Public } from '../common/decorators/public.decorator';
import type { AuthenticatedUser } from './types';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

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
            (res as any).setHeader(key, value);
        });

        (res as any).status(response.status).send(responseBody);
    }

    @Post('logout')
    async logout(@Res() res: Response) {
        return res.json({
            message: 'Loged out sucessfully'
        })
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
    @Get()
    async health() {
        return { status: "Auth Service is running" }
    }
}
