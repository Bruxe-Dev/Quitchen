import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Get DATABASE_URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Initialize Neon connection
const sql = neon(databaseUrl);

// Export Drizzle instance for use throughout the app
export const db = drizzle(sql, { schema });
