import { Module } from "@nestjs/common";
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service';
import { AuthGuard } from "../common/guards/auth.guard";
import { RoleGuard } from "../common/guards/role.guard";

@Module({
    controllers: [AuthController],
    providers: [AuthService, AuthGuard, RoleGuard],
    exports: [AuthService, AuthGuard, RoleGuard]
})

export class AuthModule { }