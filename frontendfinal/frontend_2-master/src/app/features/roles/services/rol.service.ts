import { HttpClient, HttpParams } from '@angular/common/http';
import {inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Rol, RolDto } from '../models/rol.model';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}api/roles`;

  getAll(nombre: string, estado: number): Observable<any> {
    let params = new HttpParams();
    if (nombre) {
      params = params.set('nombre', nombre);
    }
    if (estado !== 2) {
      params = params.set('estado', estado.toString());
    }
    return this.http.get<any>(`${this.apiUrl}/filtrado`, { params });
  }

create(rol: RolDto): Observable<Rol> {
return this.http.post<Rol>(this.apiUrl, rol);
}

    update(id: number, rol: RolDto): Observable<Rol> {
        return this.http.put<Rol>(`${this.apiUrl}/${id}`, rol);
    }
    
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    enable(id: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${id}/habilitar`, null);
    }
}