import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '../db/schema';

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        },
    }),

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
        minPasswordLength: 8,
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5,
        },
    },

    user: {
        additionalFields: {
            phone: {
                type: 'string',
                required: true,
            },
            role: {
                type: 'string',
                required: false,
                defaultValue: 'restaurant_owner',
                input: false,
            },
        },
    },

    trustedOrigins: [
        'http://localhost:5173',
        'http://localhost:4500',
        process.env.FRONTEND_URL || 'http://localhost:5173',
    ],

    advanced: {
        database: {
            generateId: false,
        },
    },
});

export type Auth = typeof auth;