import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ApiService } from './api.service';
import { DashboardStats, HealthStatus, SubqueriesResponse, ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private http = inject(HttpClient);
  private api = inject(ApiService);

  getStats(): Observable<{ success: boolean; stats: DashboardStats }> {
    return this.http.get<{ success: boolean; stats: DashboardStats }>(`${this.api.baseUrl}/stats`).pipe(
      catchError(err => this.api.handleError(err))
    );
  }

  getHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>(`${this.api.baseUrl}/health`).pipe(
      catchError(err => this.api.handleError(err))
    );
  }

  getSubqueries(): Observable<SubqueriesResponse> {
    return this.http.get<SubqueriesResponse>(`${this.api.baseUrl}/subqueries`).pipe(
      catchError(err => this.api.handleError(err))
    );
  }

  getConcepts(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.api.baseUrl}/concepts`).pipe(
      catchError(err => this.api.handleError(err))
    );
  }
}
