import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Paralelo, ParaleloDto } from '../models/paralelo.model';

@Injectable({ providedIn: 'root' })
export class ParaleloService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}api/paralelos`;

  getAll(nombre: string, estado: number): Observable<any> {
    let params = new HttpParams();
    if (nombre) {
      params = params.set('nombre', nombre);
    }
    if (estado !== undefined && estado !== null && estado !== 2) {
      params = params.set('estado', estado.toString());
    }
    
    return this.http.get<any>(this.apiUrl, { params });
  }

  create(paralelo: ParaleloDto): Observable<Paralelo> {
    return this.http.post<Paralelo>(this.apiUrl, paralelo);
  }

  update(id: number, paralelo: ParaleloDto): Observable<Paralelo> {
    return this.http.put<Paralelo>(`${this.apiUrl}/${id}`, paralelo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  enable(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/habilitar`, null);
  }
}
