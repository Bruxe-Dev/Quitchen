import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DbModule } from "./db/db.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,  // Available in every module without re-importing
        }),
        DbModule
    ],
})

export class AppModule { };