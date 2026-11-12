import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Nivel, NivelDto } from '../models/nivel.model';

@Injectable({
  providedIn: 'root',
})
export class NivelService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}api/niveles`;

  getAll(nombre: string, estado: number): Observable<any> {
    let params = new HttpParams();
    if (nombre) {
      params = params.set('nombre', nombre);
    }
    if (estado !== 2) {
      params = params.set('estado', estado.toString());
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  create(nivel: NivelDto): Observable<Nivel> {
    return this.http.post<Nivel>(this.apiUrl, nivel);
  }

  update(id: number, nivel: NivelDto): Observable<Nivel> {
    return this.http.put<Nivel>(`${this.apiUrl}/${id}`, nivel);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);;
  }

  enable(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/habilitar`, null);
  }

  listarActivos(): Observable<Nivel[]> {
    return this.http.get<Nivel[]>(`${this.apiUrl}`, {
      params: new HttpParams().set('estado', '1')
    });
  }
}
