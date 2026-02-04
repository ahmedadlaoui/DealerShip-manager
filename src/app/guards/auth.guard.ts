import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    // This method is called before entering a protected route
    canActivate(): boolean {
        // Check if user is logged in
        if (this.authService.isLoggedIn()) {
            // User is logged in, allow access
            return true;
        } else {
            // User is NOT logged in, redirect to login page
            this.router.navigate(['/login']);
            return false;
        }
    }
}
