import { inject, Injectable, signal } from '@angular/core';
import { Persona } from '../../../core/models/user-data';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Observable, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ComunicationService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl
    codp = signal<number>(0)
    selectedUser = signal<Persona | null>(null)    
    users = signal<Persona[] | null>(null)
    public usersListRefresh$ = new Subject<void>()

    notifyUsersListRefresh() {
        this.usersListRefresh$.next();
    }

    fetchUsers(): Observable<Persona[]> {
        return this.http.get<Persona[]>(`${this.apiUrl}api/personals`)
    }

    fetchFilteredUsers(type?: string, state?: number) :Observable<Persona[]> {
        let params = new HttpParams()
        if(type && type !== 'T') {
            params = params.set('tipo', type)
        }
        if(state !== undefined && state !== 2) {
            params = params.set('estado', state)
        }
        return this.http.get<Persona[]>(`${this.apiUrl}api/personals/filter`, { params })
    }

    sendCodp(): number {
        return this.codp()
    }

    sendUser(): Persona | null {
        return this.selectedUser()
    }
} 