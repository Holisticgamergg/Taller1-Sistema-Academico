import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DateService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl 
    
    fetchDate(): Observable<Date> {
        return this.http.get<Date>(`${this.apiUrl}api/date`)
    }
}