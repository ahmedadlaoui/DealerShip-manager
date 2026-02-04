import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from '../services/car';
import { car } from '../models/car.model';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
    selector: 'app-car-detail',
    imports: [CommonModule],
    templateUrl: './car-detail.html',
    styleUrl: './car-detail.css',
})
export class CarDetail implements OnInit {
    car: car | null = null;
    isLoading = true;
    error: string | null = null;
    currentUser: User | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private carService: Car,
        private authService: AuthService
    ) {
        this.authService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadCar(parseInt(id));
        }
    }

    loadCar(id: number): void {
        this.carService.getCarById(id).subscribe({
            next: (car) => {
                this.car = car;
                this.isLoading = false;
            },
            error: (err) => {
                this.error = 'Failed to load car details';
                this.isLoading = false;
                console.error('Error loading car:', err);
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/cars']);
    }

    formatPrice(price: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    }

    goToLogin(): void {
        this.router.navigate(['/login']);
    }

    logout(): void {
        this.authService.logout();
    }
}
