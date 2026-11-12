import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { MenuAsignadoDto, RolmeId } from '../models/rolme.model';

@Injectable({ providedIn: 'root' })
export class RolmeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}api/rolme`;

  getMenusParaAsignar(
    codr: number, 
    filtro: string = '', 
    tipo: string = 'TODOS'
  ): Observable<MenuAsignadoDto[]> {
    let params = new HttpParams()
      .set('codr', codr.toString())
      .set('tipoAsignacion', tipo);
    
    if (filtro.trim()) {
      params = params.set('filtroNombre', filtro.trim());
    }

    return this.http.get<MenuAsignadoDto[]>(`${this.apiUrl}/asignacion`, { params });
  }

  asignar(id: RolmeId): Observable<void> {
    return this.http.post<void>(this.apiUrl, id);
  }

  desasignar(id: RolmeId): Observable<void> {
    const params = new HttpParams()
      .set('codr', id.codr.toString())
      .set('codm', id.codm.toString());
    
    return this.http.delete<void>(this.apiUrl, { params });
  }
}
