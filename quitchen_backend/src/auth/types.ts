export interface AuthenticatedUser {
    id: string;
    email: string;
    roel: 'restaurant_owener' | 'platform_admin';
    phone?: string;
    image: string
}

export interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser
}