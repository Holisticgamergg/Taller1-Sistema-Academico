import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../../core/models/auth-response';

export interface FormLogin {
    login: string
    password: string
}

@Injectable({providedIn: 'root'})
export class LogInApiService {
    private http = inject(HttpClient)    
    private apiUrl = environment.apiUrl

    logIn(data: FormLogin): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}auth/login`, data)
    }
}