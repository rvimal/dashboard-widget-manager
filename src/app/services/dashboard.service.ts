import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WidgetItem } from '../models/widget.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = '/api/dashboard/layout'; // Configure your API endpoint

  constructor(private http: HttpClient) {}

  saveLayout(widgets: WidgetItem[]): Observable<any> {
    // Save to localStorage as backup
    localStorage.setItem('dashboard-layout', JSON.stringify(widgets));
    
    // Save to API
    return this.http.post(this.apiUrl, { layout: widgets }).pipe(
      catchError(error => {
        console.error('Failed to save layout to API', error);
        return of(null);
      })
    );
  }

  loadLayout(): Observable<WidgetItem[]> {
    // Try to load from API first
    return this.http.get<WidgetItem[]>(this.apiUrl).pipe(
      catchError(() => {
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem('dashboard-layout');
        return of(saved ? JSON.parse(saved) : []);
      })
    );
  }
}
