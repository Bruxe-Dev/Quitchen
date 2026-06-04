import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthService } from "../../auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private reflector: Reflector
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Check if this route is marked as public
        const isPublic = this.reflector.get<boolean>(
            'isPublic',
            context.getHandler(),
        );

        if (isPublic) {
            return true; // Skip auth for public routes
        }

        const request = context.switchToHttp().getRequest();
        const session = await this.authService.validateSession(request);

        if (!session || !session.user) {
            throw new UnauthorizedException('Invalid or missing session');
        }

        // Attach user to request object
        request.user = session.user;
        return true;
    }
}