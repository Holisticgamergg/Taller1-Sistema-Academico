import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserDetails } from '../../../core/services/user-details';
import { environment } from '../../../../environments/environment.development';
import { RegisterPersonalRequest } from '../models/register-request';
import { Observable } from 'rxjs';
import { Persona } from '../../../core/models/user-data';
import { RegisterDataRequest } from '../models/register-data-request';
import { ChangePasswordRequest } from '../models/change-password-request';
import { AuthResponse } from '../../../core/models/auth-response';
import { PersonRequest } from '../models/person-request';

@Injectable({providedIn: 'root'})
export class UserApiService {
    private http = inject(HttpClient)
    private user = inject(UserDetails)  
    private apiUrl = environment.apiUrl

    registerUser(register: RegisterPersonalRequest): Observable<Persona> {
        return this.http.post<Persona>(`${this.apiUrl}api/personals`, register)
    }

    registerAccessData(data: RegisterDataRequest) {
        return this.http.post(`${this.apiUrl}auth/register`, data)
    }

    modifPassAccessData(request: ChangePasswordRequest): Observable<AuthResponse> {
        return this.http.put<AuthResponse>(`${this.apiUrl}auth/change-password`, request)
    }

    enableUser(id: number, state: number) {
        return this.http.put(`${this.apiUrl}api/personals/${id}/${state}`, null)
    }

    disableUser(id: number, state: number) {
        return this.http.put(`${this.apiUrl}api/personals/${id}/${state}`, null)
    }

    updatePersonal(person: PersonRequest, id: number): Observable<Persona> {
        return this.http.put<Persona>(`${this.apiUrl}api/personals/${id}`, person)
    }

    getProfesores(): Observable<Persona[]> {
        const params = { tipo: 'P', estado: '1' };
        return this.http.get<Persona[]>(`${this.apiUrl}api/personals/filter`, { params })
    }

    getPersonalById(id: number): Observable<Persona> {
        return this.http.get<Persona>(`${this.apiUrl}api/personals/${id}`)
    }
}