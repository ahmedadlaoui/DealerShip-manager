import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, LoginRequest } from '../models/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    // API URL for users
    private apiUrl = 'http://localhost:3000/users';

    // BehaviorSubject to track current user (null = not logged in)
    private currentUserSubject = new BehaviorSubject<User | null>(null);

    // Observable that components can subscribe to
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        // When app starts, check if user was already logged in
        this.loadUserFromStorage();
    }

    // Check localStorage for saved user
    private loadUserFromStorage(): void {
        const savedUser = localStorage.getItem('currentUser');
        const savedToken = localStorage.getItem('token');

        if (savedUser && savedToken) {
            this.currentUserSubject.next(JSON.parse(savedUser));
        }
    }

    // Login function
    login(credentials: LoginRequest): Observable<{ success: boolean; message: string }> {
        // Get users from db.json and find matching user
        return this.http.get<User[]>(this.apiUrl).pipe(
            map((users) => {
                // Find user with matching username and password
                const user = users.find(
                    (u) => u.username === credentials.username && u.password === credentials.password
                );

                if (user) {
                    // Create a simple token (in real app, this comes from server)
                    const token = 'fake-jwt-token-' + user.id + '-' + Date.now();

                    // Remove password before storing
                    const userWithoutPassword = { ...user };
                    delete userWithoutPassword.password;

                    // Save to localStorage
                    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
                    localStorage.setItem('token', token);

                    // Update the BehaviorSubject
                    this.currentUserSubject.next(userWithoutPassword);

                    return { success: true, message: 'Login successful!' };
                } else {
                    return { success: false, message: 'Invalid username or password' };
                }
            }),
            catchError((error) => {
                console.error('Login error:', error);
                return of({ success: false, message: 'Server error. Please try again.' });
            })
        );
    }

    // Logout function
    logout(): void {
        // Remove from localStorage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');

        // Clear the BehaviorSubject
        this.currentUserSubject.next(null);
    }

    // Check if user is logged in
    isLoggedIn(): boolean {
        return this.currentUserSubject.value !== null;
    }

    // Get current user
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    // Get token
    getToken(): string | null {
        return localStorage.getItem('token');
    }
}
