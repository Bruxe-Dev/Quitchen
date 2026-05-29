import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';


export const DB = Symbol('DB');

@Global() //This makes the module available accross the application
@Module({
    providers: [
        {
            provide: DB,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const databaseUrl = config.get<string>('DATABASE_URL');
                if (!databaseUrl) {
                    throw new Error('DATABASE_URL environment variable is not set');
                }
                const sql = neon(databaseUrl);
                return drizzle(sql, { schema });
            },
        },
    ],
    exports: [DB],
})

export class dbModule { };