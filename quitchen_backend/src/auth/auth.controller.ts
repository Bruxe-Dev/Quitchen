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
    }
}