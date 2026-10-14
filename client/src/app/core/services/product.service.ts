import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ApiService } from './api.service';
import { Product, ProductFormData } from '../../models/product.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private api = inject(ApiService);
  private endpoint = `${this.api.baseUrl}/products`;

  getProducts(category?: string, search?: string, sort?: string): Observable<ApiResponse<Product[]>> {
    let params = new HttpParams();
    if (category && category !== 'All') {
      params = params.set('category', category);
    }
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<ApiResponse<Product[]>>(this.endpoint, { params }).pipe(
      catchError(err => this.api.handleError(err))
    );
  }

  getProductById(id: number | string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.endpoint}/${id}`).pipe(
      catchError(err => this.api.handleError(err))
    );
  }

  createProduct(payload: ProductFormData): Observable<ApiResponse<{ insertId: number }>> {
    return this.http.post<ApiResponse<{ insertId: number }>>(this.endpoint, payload).pipe(
      catchError(err => this.api.handleError(err))
    );
  }

  updateProduct(id: number | string, payload: Partial<ProductFormData>): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.endpoint}/${id}`, payload).pipe(
      catchError(err => this.api.handleError(err))
    );
  }

  deleteProduct(id: number | string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.endpoint}/${id}`).pipe(
      catchError(err => this.api.handleError(err))
    );
  }
}
