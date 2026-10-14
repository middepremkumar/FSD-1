import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly baseUrl = '/api';

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected server error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || error.error?.error || `Server returned code ${error.status}: ${error.statusText}`;
    }
    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
