import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { RolAsignadoDto, UsurolId } from '../models/usurol.model';

@Injectable({ providedIn: 'root' })
export class UsurolService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}api/usurol`;

  getRolesParaAsignar(
    login: string, 
    filtro: string = '', 
    tipo: string = 'TODOS'
  ): Observable<RolAsignadoDto[]> {
    let params = new HttpParams()
      .set('login', login)
      .set('tipoAsignacion', tipo);  // Cambiar 'tipo' por 'tipoAsignacion'
    
    // Solo agregar filtro si tiene contenido (para que el backend reciba null)
    if (filtro && filtro.trim()) {
      params = params.set('filtroNombre', filtro.trim());  // Cambiar 'filtro' por 'filtroNombre'
    }

    return this.http.get<RolAsignadoDto[]>(`${this.apiUrl}/asignacion`, { params });
  }

  asignar(id: UsurolId): Observable<void> {
    return this.http.post<void>(this.apiUrl, id);
  }

  desasignar(id: UsurolId): Observable<void> {
    const params = new HttpParams()
      .set('codr', id.codr.toString())
      .set('login', id.login);
    
    return this.http.delete<void>(this.apiUrl, { params });
  }
}
