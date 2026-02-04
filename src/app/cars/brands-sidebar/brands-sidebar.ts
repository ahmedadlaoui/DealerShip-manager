import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brands-sidebar',
  imports: [CommonModule],
  templateUrl: './brands-sidebar.html',
  styleUrl: './brands-sidebar.css',
})
export class BrandsSidebar {
  @Output() brandSelected = new EventEmitter<string>();

  selectedBrand = 'all';

  brands = [
    { value: 'all', label: 'All Brands' },
    { value: 'Audi', label: 'Audi' },
    { value: 'BMW', label: 'BMW' },
    { value: 'Jaguar', label: 'Jaguar' },
    { value: 'Lexus', label: 'Lexus' },
    { value: 'Mercedes-Benz', label: 'Mercedes-Benz' },
    { value: 'Mercedes-AMG', label: 'Mercedes-AMG' },
    { value: 'Porsche', label: 'Porsche' },
    { value: 'Range Rover', label: 'Range Rover' },
    { value: 'Tesla', label: 'Tesla' },
    { value: 'Volvo', label: 'Volvo' }
  ];

  selectBrand(brand: string, event: Event): void {
    event.preventDefault();
    this.selectedBrand = brand;
    this.brandSelected.emit(brand);
  }
}
