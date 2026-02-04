// User model - represents a user in our system
export interface User {
    id: number;
    username: string;
    password?: string; // Optional because we don't want to store it in state
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'employee';
}

// What we get back after login
export interface LoginResponse {
    user: User;
    token: string;
}

// What we send to login
export interface LoginRequest {
    username: string;
    password: string;
}
