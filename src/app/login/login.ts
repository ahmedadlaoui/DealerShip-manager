import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    // Form fields
    username = '';
    password = '';

    // UI states
    isLoading = false;
    errorMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        // If already logged in, go to cars page
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/cars']);
        }
    }

    // Called when form is submitted
    onLogin(): void {
        // Reset error message
        this.errorMessage = '';

        // Basic validation
        if (!this.username || !this.password) {
            this.errorMessage = 'Please enter username and password';
            return;
        }

        // Show loading
        this.isLoading = true;

        // Call auth service
        this.authService.login({ username: this.username, password: this.password }).subscribe({
            next: (result) => {
                this.isLoading = false;

                if (result.success) {
                    // Login worked! Go to cars page
                    this.router.navigate(['/cars']);
                } else {
                    // Show error
                    this.errorMessage = result.message;
                }
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = 'Something went wrong. Please try again.';
                console.error('Login error:', err);
            }
        });
    }
}
