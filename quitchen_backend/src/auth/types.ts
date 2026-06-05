export interface AuthenticatedUser {
    id: string;
    name: string;
    email: string;
    role: 'restaurant_owener' | 'platform_admin';
    phone?: string;
    image: string
}

export interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser
}