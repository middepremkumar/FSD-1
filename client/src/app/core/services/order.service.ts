import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { Order, CreateOrderPayload, OrderCreationResponse } from '../../models/order.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private api = inject(ApiService);
  private endpoint = `${this.api.baseUrl}/orders`;

  // Prevent duplicate submissions while an order request is in-flight
  readonly isSubmitting = signal<boolean>(false);

  getOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(this.endpoint).pipe(
      catchError(err => this.api.handleError(err))
    );
  }

  submitOrder(payload: CreateOrderPayload): Observable<OrderCreationResponse> {
    if (this.isSubmitting()) {
      return throwError(() => new Error('Order submission is already in progress. Please wait.'));
    }

    this.isSubmitting.set(true);

    return this.http.post<OrderCreationResponse>(this.endpoint, payload).pipe(
      catchError(err => this.api.handleError(err)),
      finalize(() => {
        this.isSubmitting.set(false);
      })
    );
  }

  updateOrderStatus(orderId: number, status: string): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.endpoint}/${orderId}/status`, { status }).pipe(
      catchError(err => this.api.handleError(err))
    );
  }
}
