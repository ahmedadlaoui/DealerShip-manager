import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Car, CarFilters } from '../services/car';
import { car } from '../models/car.model';
import { BrandsSidebar } from './brands-sidebar/brands-sidebar';
import { SearchControls } from './search-controls/search-controls';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-cars',
  imports: [CommonModule, BrandsSidebar, SearchControls],
  templateUrl: './cars.html',
  styleUrl: './cars.css',
})
export class Cars implements OnInit {

  isGridView = true;
  cars: car[] = [];

  // Pagination
  page = 1;
  size = 9;
  totalPages = 1;
  totalItems = 0;

  // Filters
  currentFilters: CarFilters = {};

  // Current user (null if not logged in)
  currentUser: User | null = null;

  constructor(
    private carService: Car,
    private router: Router,
    private authService: AuthService
  ) {
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  setView(view: 'grid' | 'list') {
    this.isGridView = view === 'grid';
  }

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getCars(this.page, this.size, this.currentFilters).subscribe({
      next: (response) => {
        this.cars = response.body || [];

        // Get total count from headers (json-server returns X-Total-Count)
        const totalCount = response.headers.get('X-Total-Count');
        if (totalCount) {
          this.totalItems = parseInt(totalCount);
          this.totalPages = Math.ceil(this.totalItems / this.size);
        }
      },
      error: (err) => {
        console.error('Error while bringing cars:', err);
      }
    });
  }

  onFiltersChange(filters: CarFilters): void {
    this.currentFilters = { ...this.currentFilters, ...filters };
    this.page = 1; // Reset to first page when filters change
    this.loadCars();
  }

  onBrandSelect(brand: string): void {
    this.currentFilters = { ...this.currentFilters, brand };
    this.page = 1;
    this.loadCars();
  }

  // Pagination methods
  goToPage(pageNum: number): void {
    if (pageNum >= 1 && pageNum <= this.totalPages) {
      this.page = pageNum;
      this.loadCars();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadCars();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadCars();
    }
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, this.page - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  // Navigation to car detail
  viewCarDetails(carId: number): void {
    this.router.navigate(['/cars', carId]);
  }

  // Go to login page
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Logout user
  logout(): void {
    this.authService.logout();
  }
}
