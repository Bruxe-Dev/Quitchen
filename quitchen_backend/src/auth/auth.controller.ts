import { All, Response, Req, Res, Controller } from '@nestjs/common'
import { AuthService } from './auth.service'

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
}