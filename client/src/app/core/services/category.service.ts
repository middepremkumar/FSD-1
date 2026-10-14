import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, shareReplay } from 'rxjs';
import { ApiService } from './api.service';
import { Category } from '../../models/category.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private api = inject(ApiService);
  private endpoint = `${this.api.baseUrl}/categories`;

  private categoriesCache$?: Observable<ApiResponse<Category[]>>;

  getCategories(forceRefresh = false): Observable<ApiResponse<Category[]>> {
    if (!this.categoriesCache$ || forceRefresh) {
      this.categoriesCache$ = this.http.get<ApiResponse<Category[]>>(this.endpoint).pipe(
        shareReplay(1),
        catchError(err => this.api.handleError(err))
      );
    }
    return this.categoriesCache$;
  }
}
