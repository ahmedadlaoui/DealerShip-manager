import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarFilters } from '../../services/car';

@Component({
  selector: 'app-search-controls',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-controls.html',
  styleUrl: './search-controls.css',
})
export class SearchControls {

  @Input() isGridView = true;
  @Output() viewChanged = new EventEmitter<boolean>();
  @Output() filtersChanged = new EventEmitter<CarFilters>();

  filters: CarFilters = {};

  fuelTypes = ['all', 'Essence', 'Diesel', 'Électrique', 'Hybride'];
  years = [2024, 2023, 2022, 2021, 2020];
  priceRanges = [
    { label: 'All Prices', min: undefined, max: undefined },
    { label: 'Under $60,000', min: undefined, max: 60000 },
    { label: '$60,000 - $80,000', min: 60000, max: 80000 },
    { label: '$80,000 - $100,000', min: 80000, max: 100000 },
    { label: 'Over $100,000', min: 100000, max: undefined }
  ];

  selectedFuelType = 'all';
  selectedYear = 'all';
  selectedPriceRange = 0;

  setView(view: 'grid' | 'list') {
    this.isGridView = view === 'grid';
    this.viewChanged.emit(this.isGridView);
  }

  onFuelTypeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedFuelType = value;
    this.emitFilters();
  }

  onYearChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedYear = value;
    this.emitFilters();
  }

  onPriceRangeChange(event: Event) {
    const index = parseInt((event.target as HTMLSelectElement).value);
    this.selectedPriceRange = index;
    this.emitFilters();
  }

  emitFilters() {
    const filters: CarFilters = {};

    if (this.selectedFuelType !== 'all') {
      filters.fuelType = this.selectedFuelType;
    }

    if (this.selectedYear !== 'all') {
      filters.minYear = parseInt(this.selectedYear);
      filters.maxYear = parseInt(this.selectedYear);
    }

    const priceRange = this.priceRanges[this.selectedPriceRange];
    if (priceRange.min) {
      filters.minPrice = priceRange.min;
    }
    if (priceRange.max) {
      filters.maxPrice = priceRange.max;
    }

    this.filtersChanged.emit(filters);
  }

  resetFilters() {
    this.selectedFuelType = 'all';
    this.selectedYear = 'all';
    this.selectedPriceRange = 0;
    this.emitFilters();
  }
}
