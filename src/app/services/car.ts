import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { car } from '../models/car.model';

export interface CarFilters {
  brand?: string;
  fuelType?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
}

@Injectable({
  providedIn: 'root',
})
export class Car {

  private readonly apiUrl = 'http://localhost:3000/cars';

  constructor(private http: HttpClient) { }

  getCars(page: number = 1, limit: number = 9, filters: CarFilters = {}): Observable<HttpResponse<car[]>> {
    let params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    if (filters.brand && filters.brand !== 'all') {
      params = params.set('brand', filters.brand);
    }

    if (filters.fuelType && filters.fuelType !== 'all') {
      params = params.set('fuelType', filters.fuelType);
    }

    if (filters.minPrice) {
      params = params.set('price_gte', filters.minPrice.toString());
    }

    if (filters.maxPrice) {
      params = params.set('price_lte', filters.maxPrice.toString());
    }

    if (filters.minYear) {
      params = params.set('year_gte', filters.minYear.toString());
    }

    if (filters.maxYear) {
      params = params.set('year_lte', filters.maxYear.toString());
    }

    return this.http.get<car[]>(this.apiUrl, { params, observe: 'response' });
  }

  getCarById(id: number): Observable<car> {
    return this.http.get<car>(`${this.apiUrl}/${id}`);
  }

  getAllCars(): Observable<car[]> {
    return this.http.get<car[]>(this.apiUrl);
  }
}
