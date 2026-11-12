import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ProcesoAsignadoDto, MeproId } from '../models/mepro.model';

@Injectable({ providedIn: 'root' })
export class MeproService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}api/mepro`;

  getProcesosParaAsignar(
    codm: number, 
    filtro: string = '', 
    tipoAsignacion: string = 'TODOS'
  ): Observable<ProcesoAsignadoDto[]> {
    let params = new HttpParams()
      .set('codm', codm.toString())
      .set('tipoAsignacion', tipoAsignacion);
    
    if (filtro.trim()) {
      params = params.set('filtro', filtro.trim());
    }

    
    return this.http.get<ProcesoAsignadoDto[]>(`${this.apiUrl}/asignacion`, { params });
  }

  asignarProceso(id: MeproId): Observable<void> {
    return this.http.post<void>(this.apiUrl, id);
  }

  desasignarProceso(id: MeproId): Observable<void> {
    const params = new HttpParams()
      .set('codm', id.codm.toString())
      .set('codp', id.codp.toString());
    
    return this.http.delete<void>(this.apiUrl, { params });
  }
}
